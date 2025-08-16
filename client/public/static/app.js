const $  = (id)=>document.getElementById(id);
const qa = (sel)=>Array.from(document.querySelectorAll(sel));

/* ---------------- Tabs ---------------- */
qa(".tab").forEach(t=>{
  t.onclick = ()=>{
    qa(".tab").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    const name = t.dataset.tab;
    qa("[data-pane]").forEach(p=>p.style.display = (p.dataset.pane===name)?"block":"none");
  };
});

/* ---------------- Helper utils ---------------- */
function v(id){ return $(id)?.value || undefined; }
async function postJSON(url, body){
  const r = await fetch(url,{method:"POST",headers:{ "Content-Type":"application/json" },body:JSON.stringify(body)});
  return r.json();
}
function empty(msg="No results yet."){ return `<div class="card" style="grid-column:1/-1;text-align:center;color:#64748b">${msg}</div>`; }

/* ---------------- Anywhere/Date chips logic ---------------- */
function setMonthRange(monthOffset=0){
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth()+monthOffset, 5);
  const end   = new Date(now.getFullYear(), now.getMonth()+monthOffset, 19);
  $("d_depart").value = start.toISOString().slice(0,10);
  $("d_return").value = end.toISOString().slice(0,10);
}
qa("[data-chip]").forEach(btn=>{
  btn.onclick = ()=>{
    const k = btn.dataset.chip;
    if (k==="spontaneous"){
      const d1 = new Date(); d1.setDate(d1.getDate()+7);
      const d2 = new Date(); d2.setDate(d2.getDate()+11);
      $("d_depart").value = d1.toISOString().slice(0,10);
      $("d_return").value = d2.toISOString().slice(0,10);
    } else if (k==="this_month"){ setMonthRange(0); }
    else if (k==="next_month"){ setMonthRange(1); }
    else if (k==="this_year"){
      const d1 = new Date(); d1.setMonth(d1.getMonth()+2, 10);
      const d2 = new Date(); d2.setMonth(d1.getMonth(), d1.getDate()+7);
      $("d_depart").value = d1.toISOString().slice(0,10);
      $("d_return").value = d2.toISOString().slice(0,10);
    }
  };
});

/* ---------------- Light IATA helpers ---------------- */
const CITY_TO_IATA = {
  "nashville":"BNA","new york":"JFK","nyc":"JFK","miami":"MIA",
  "paris":"CDG","rome":"FCO","london":"LHR","tokyo":"HND","chicago":"ORD","los angeles":"LAX","la":"LAX","san francisco":"SFO","sf":"SFO"
};
const CITY_TO_CITYCODE = { "paris":"PAR","rome":"ROM","london":"LON","new york":"NYC","nyc":"NYC","tokyo":"TYO","miami":"MIA","chicago":"CHI" };

function guessIATA(s, fallback){
  if(!s) return fallback;
  const k = s.trim().toLowerCase();
  if (k.length===3 && /^[a-z]{3}$/.test(k)) return k.toUpperCase(); // IATA given
  return (CITY_TO_IATA[k] || fallback).toUpperCase();
}
function guessCityCode(s, fallback){
  if(!s) return fallback;
  const k = s.trim().toLowerCase();
  if (k.length===3 && /^[a-z]{3}$/.test(k)) return k.toUpperCase(); // already an IATA city
  return (CITY_TO_CITYCODE[k] || fallback).toUpperCase();
}

/* ---------------- "Deal" CTA: orchestrates everything ---------------- */
$("deal_cta").onclick = async ()=>{
  const useAI = $("use_ai").checked;

  // Parse NL if the user typed a natural phrase into from/to
  let params = {};
  const nl = [v("d_from"), v("d_to")].filter(Boolean).join(" to ");
  if (useAI && nl){
    try { params = (await postJSON("/api/travel/parse",{ text: nl })).params || {}; } catch {}
  }

  const origin      = guessIATA(v("d_from") || params.origin, "JFK");
  const destination = (v("d_to") || params.destination || "").trim();
  const depart      = v("d_depart") || params.departDate;
  const ret         = v("d_return") || params.returnDate;
  const budgetRaw   = v("d_budget"); 
  const maxPrice    = budgetRaw ? Number((budgetRaw+"").replace(/[^0-9.]/g,"")) : undefined;
  const cabin       = "ECONOMY";
  const nonStop     = false;
  const flex        = v("d_flex");      // exact | +-3 | weekend | month
  const flightsOnly = $("d_flights_only").checked;
  const wantHotels  = $("d_include_hotels").checked;
  const wantCars    = $("d_include_cars").checked;
  const wantMistake = $("d_mistake").checked;

  // Build a list of date pairs based on flexibility
  const datePairs = [];
  const dep = new Date(depart || new Date().toISOString().slice(0,10));
  const retD = ret ? new Date(ret) : new Date(dep.getTime()+3*86400000);

  function addPair(d1,d2){ datePairs.push([ d1.toISOString().slice(0,10), d2.toISOString().slice(0,10) ]); }

  if (flex==="exact"){ addPair(dep, retD); }
  else if (flex==="+-3"){
    for (let shift=-3; shift<=3; shift++){
      const d1 = new Date(dep); d1.setDate(d1.getDate()+shift);
      const d2 = new Date(retD); d2.setDate(d2.getDate()+shift);
      addPair(d1,d2);
    }
  } else if (flex==="weekend"){
    // find next Fri–Sun
    const d1 = new Date(dep);
    while (d1.getDay()!==5) d1.setDate(d1.getDate()+1);
    const d2 = new Date(d1); d2.setDate(d1.getDate()+2);
    addPair(d1,d2);
  } else if (flex==="month"){
    // first 4 weekends as candidates
    const base = new Date(dep.getFullYear(), dep.getMonth(), 1);
    let d1 = new Date(base);
    while (d1.getDay()!==5) d1.setDate(d1.getDate()+1);
    for (let i=0;i<4;i++){
      const start = new Date(d1); start.setDate(d1.getDate()+7*i);
      const end = new Date(start); end.setDate(start.getDate()+2);
      addPair(start,end);
    }
  }

  // "Anywhere" support: small curated list for MVP
  const ANYWHERE = ["LON","PAR","ROM","BCN","TYO"];
  const destList = destination ? [guessIATA(destination, "FCO")] : ANYWHERE;

  // Fan out flight searches (limit to a safe #)
  $("dealResults").innerHTML = "";
  const allOffers = [];
  for (const d of destList){
    for (const [dd, rr] of datePairs.slice(0,8)){   // cap calls
      const res = await postJSON("/api/travel/flights/search", {
        origin, destination: d, departDate: dd, returnDate: rr, nonStop, cabin, maxPrice
      });
      (res.offers||[]).forEach(o=>{
        // Optionally demote non-mistake fares when user ticks 'Mistake fares'
        if (wantMistake && o.tier === "standard") o.priceUSD += 0.01; // stable sort nudge
        allOffers.push({ ...o, _route:`${origin}→${d}`, _dates:`${dd}→${rr}` });
      });
    }
  }
  allOffers.sort((a,b)=>a.priceUSD-b.priceUSD);
  renderFlightsInto("dealResults", allOffers.slice(0,12));

  // AI summary for flights (optional)
  $("dealSummary").innerHTML="";
  if ($("use_ai").checked && allOffers.length){
    try {
      const s = await postJSON("/api/travel/summary", { offers: allOffers.slice(0,8), origin, destination: destList.join(",") });
      if (s.summary) $("dealSummary").innerHTML = s.summary.replaceAll("\n","<br/>");
    } catch {}
  }

  // Hotels & Cars (conditional based on preferences)
  if (!flightsOnly && wantHotels){
    const cityCode = guessCityCode(destination || "rome", "ROM");
    const h = await postJSON("/api/travel/hotels/search", {
      cityCode, checkInDate: datePairs[0][0], checkOutDate: datePairs[0][1], adults: 2, roomQuantity: 1
    });
    renderHotelsInto("dealResults", (h.data||[]).slice(0,6));
  }
  
  if (!flightsOnly && wantCars){
    const cityCode = guessCityCode(destination || "rome", "ROM");
    const c = await postJSON("/api/travel/cars/search", {
      cityCode, pickUpDateTime: new Date(datePairs[0][0]+"T10:00:00").toISOString(),
      dropOffDateTime: new Date(datePairs[0][1]+"T10:00:00").toISOString(), passengers: 2
    });
    renderCarsInto("dealResults", (c.offers||[]).slice(0,4));
  }
};

/* ---------------- Dedicated tab forms (still work) ---------------- */
$("flightForm")?.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const body = {
    origin:v("origin"), destination:v("destination"),
    departDate:v("departDate"), returnDate:v("returnDate"),
    maxPrice:v("maxPrice"), cabin:v("cabin"), nonStop:$("nonStop").checked
  };
  const res = await postJSON("/api/travel/flights/search", body);
  renderFlightsInto("flightResults", res.offers||[]);
  $("flightSummary").innerHTML="";
  if ($("use_ai").checked && (res.offers||[]).length){
    try{
      const s = await postJSON("/api/travel/summary", { offers: res.offers, origin: body.origin, destination: body.destination });
      if (s.summary) $("flightSummary").innerHTML = s.summary.replaceAll("\n","<br/>");
    }catch{}
  }
});

$("hotelForm")?.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const res = await postJSON("/api/travel/hotels/search", {
    cityCode:v("h_cityCode"), checkInDate:v("h_checkIn"), checkOutDate:v("h_checkOut"),
    adults:parseInt(v("h_adults")||"2",10), roomQuantity:parseInt(v("h_rooms")||"1",10)
  });
  renderHotelsInto("hotelResults", res.data||[]);
});

$("carForm")?.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const res = await postJSON("/api/travel/cars/search", {
    cityCode:v("c_cityCode"),
    pickUpDateTime: v("c_pick") ? new Date(v("c_pick")).toISOString() : undefined,
    dropOffDateTime: v("c_drop") ? new Date(v("c_drop")).toISOString() : undefined,
    passengers: parseInt(v("c_pax")||"2",10)
  });
  renderCarsInto("carResults", res.offers||[]);
});

/* ---------------- Renderers ---------------- */
function renderFlightsInto(rootId, list){
  const root=$(rootId); if(!root) return; root.innerHTML="";
  if (!list.length) return root.innerHTML=empty("No flights found. Try wider dates.");
  list.forEach(o=>{
    const badge = o.tier==="unicorn"?"🦄 mistake-fare-like": o.tier==="great"?"🔥 great": o.tier==="cheap"?"✅ cheap":"—";
    const segs = (o.itineraries||[]).flatMap(it=>it.segments||[]);
    const path = segs.map(s=>`${s.from}→${s.to}`).join(" · ");
    const card=document.createElement("article");
    card.className="card";
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">$${o.priceUSD.toFixed(0)} USD</h3>
        <span class="badge">${badge}</span>
      </div>
      <div class="muted" style="font-size:12px;margin-top:4px;">
        CPM ~$${(o.cpm||0).toFixed(2)}/mile ${o.validatingAirline?("• "+o.validatingAirline):""}
        ${o._route?` • ${o._route}`:""} ${o._dates?` • ${o._dates}`:""}
      </div>
      <div style="margin-top:6px;">${path}</div>
    `;
    root.appendChild(card);
  });
}

function renderHotelsInto(rootId, list){
  const root=$(rootId); if(!root) return;
  if (!list.length) return;
  const head=document.createElement("div");
  head.className="muted"; head.style.marginTop="8px"; head.innerHTML="— Hotels —";
  root.appendChild(head);
  list.forEach(h=>{
    const offer = h.offers?.[0] || {};
    const card=document.createElement("article");
    card.className="card";
    card.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">${h.hotel?.name||"Hotel"}</h3>
        <strong>$${(offer.price?.total||0)} ${offer.price?.currency||"USD"}</strong>
      </div>
      <div class="muted" style="font-size:12px;margin-top:4px;">${offer.checkInDate} → ${offer.checkOutDate} • ${h.hotel?.cityCode||""}</div>
      <div style="margin-top:6px;">${h.hotel?.hotelId||""}</div>
    `;
    root.appendChild(card);
  });
}

function renderCarsInto(rootId, list){
  const root=$(rootId); if(!root) return;
  if (!list.length) return;
  const head=document.createElement("div");
  head.className="muted"; head.style.marginTop="8px"; head.innerHTML="— Cars / Transfers —";
  root.appendChild(head);
  list.forEach(c=>{
    const card=document.createElement("article");
    card.className="card";
    card.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">${c.vehicle||"Vehicle"} • $${(c.priceUSD||0).toFixed(0)} USD</h3>
        <span class="badge">${c.supplier||""}</span>
      </div>
      <div class="muted" style="font-size:12px;margin-top:4px;">${c.pickUp?.cityCode||""} ${c.pickUp?.at||""} → ${c.dropOff?.cityCode||""} ${c.dropOff?.at||""}</div>
    `;
    root.appendChild(card);
  });
}