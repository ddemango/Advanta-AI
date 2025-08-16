"use client";
import { useState } from "react";

const toYMD = (d: Date) =>
  [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-");

export default function TravelHackerAIV3() {
  const [pane, setPane] = useState<"deal"|"flights"|"hotels"|"cars">("deal");
  const [useAI, setUseAI] = useState(true);
  const [findState, setFind] = useState({
    from: "", to: "", depart: "", ret: "", budget: "", flex:"exact",
    flightsOnly:true, includeHotels:false, includeCars:false, mistake:true,
    region:"", nearby:true, currency:"USD", cabin:"ECONOMY", maxStops:null as null|0|1|2,
    allowCarriers:"", blockCarriers:""
  });
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState("");

  const post = async (url:string, body:any) => {
    const r = await fetch(url, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body)});
    let data:any; try { data = await r.json(); } catch { data = {error:"bad_json"}; }
    if (!r.ok && !data.error) data.error = `HTTP ${r.status}`;
    return data;
  };

  const findDeal = async () => {
    setSummary(""); setResults([]);
    const origin = (findState.from || "JFK").toUpperCase();
    const dest   = findState.to ? findState.to.toUpperCase() : null;
    const payload = {
      origin,
      destination: dest,
      region: findState.region || null,
      departDate: findState.depart || null,
      returnDate: findState.ret || null,
      flexibility: findState.flex,
      includeNearby: findState.nearby,
      cabin: findState.cabin,
      currency: findState.currency,
      mistakeBias: findState.mistake,
      filters: {
        maxStops: findState.maxStops,
        allowCarriers: findState.allowCarriers ? findState.allowCarriers.split(",").map(s=>s.trim().toUpperCase()) : undefined,
        blockCarriers: findState.blockCarriers ? findState.blockCarriers.split(",").map(s=>s.trim().toUpperCase()) : undefined,
      }
    };
    const res = await post("/api/travel/deals/find", payload);
    const offers = (res.offers||[]).slice(0, 20);
    setResults(offers);

    if (useAI && offers.length){
      const s = await post("/api/travel/summary", { offers: offers.slice(0,8), origin, destination: dest || (payload.region||"Anywhere") });
      if (s.summary) setSummary(s.summary);
    }
  };

  return (
    <div style={{fontFamily:"ui-sans-serif,system-ui", background:"#f7fafc", color:"#0f172a", minHeight:"100vh"}}>
      <style>{`
        .container{max-width:980px;margin:0 auto;padding:0 16px}
        .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px}
        .grid{display:grid;gap:12px;grid-template-columns:1fr 1fr;margin-top:16px}
        @media (max-width:800px){.grid{grid-template-columns:1fr}}
        .pill{border:1px solid #e5e7eb;padding:8px 12px;border-radius:12px;background:#fff}
        .badge{font-size:12px;padding:4px 8px;border-radius:999px;border:1px solid #e5e7eb}
        .muted{color:#64748b}
        .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .row3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .cta{background:#275afe;color:#fff;border:none;border-radius:12px;padding:14px 16px;font-weight:600;width:100%}
        .tab{padding:8px 14px;border:1px solid #e5e7eb;border-radius:999px;background:#fff;cursor:pointer}
        .tab.active{background:#0f172a;color:#fff;border-color:#0f172a}
        input, select{width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-top:4px}
        label{display:block;font-size:14px;font-weight:500;margin-bottom:8px}
      `}</style>

      <header style={{textAlign:"center", padding:"40px 20px"}}>
        <div className="container">
          <h1 style={{fontSize:40, margin:"10px 0"}}>Travel Hacker AI</h1>
          <p className="muted" style={{maxWidth:740, margin:"0 auto", color:"#475569"}}>
            Ultra-cheap roundtrips · ⚡ rare mistake fares · 🧳 full budget travel plans
          </p>
          <div style={{display:"flex", gap:8, justifyContent:"center", margin:"16px 0 10px"}}>
            {["deal","flights","hotels","cars"].map(t=>(
              <button key={t} className={`tab ${pane===t?"active":""}`} onClick={()=>setPane(t as any)}>
                {t==="deal"?"Find My Travel Deal":t[0].toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
          <div className="muted"><label><input type="checkbox" checked={useAI} onChange={e=>setUseAI(e.target.checked)}/> Use AI parsing/summaries</label></div>
        </div>
      </header>

      <main className="container">
        {pane==="deal" && (
          <section className="card">
            <h3 style={{fontWeight:700, margin:"0 0 8px"}}>Find My Travel Deal</h3>
            <div className="row">
              <div><label>Departure City</label><input placeholder="e.g., BNA or Nashville" value={findState.from} onChange={e=>setFind({...findState, from:e.target.value})}/></div>
              <div><label>Destination (Optional)</label><input placeholder="IATA or city; leave blank for Anywhere/Region" value={findState.to} onChange={e=>setFind({...findState, to:e.target.value})}/></div>
            </div>

            <div style={{marginTop:10}} className="row">
              <div><label>Depart</label><input type="date" value={findState.depart} onChange={e=>setFind({...findState, depart:e.target.value})}/></div>
              <div><label>Return</label><input type="date" value={findState.ret} onChange={e=>setFind({...findState, ret:e.target.value})}/></div>
            </div>

            <div className="row" style={{marginTop:10}}>
              <div><label>Date Flexibility</label>
                <select value={findState.flex} onChange={e=>setFind({...findState, flex:e.target.value as any})}>
                  <option value="exact">Exact dates</option>
                  <option value="+-3">± 3 days</option>
                  <option value="weekend">Weekend only</option>
                  <option value="month">Any weekend this month</option>
                </select>
              </div>
              <div><label>Region (optional)</label>
                <select value={findState.region} onChange={e=>setFind({...findState, region:e.target.value})}>
                  <option value="">—</option>
                  <option value="EUROPE">Europe</option>
                  <option value="ASIA">Asia</option>
                </select>
              </div>
            </div>

            <div className="row" style={{marginTop:10}}>
              <div><label>Currency</label>
                <select value={findState.currency} onChange={e=>setFind({...findState, currency:e.target.value})}>
                  <option>USD</option><option>EUR</option><option>GBP</option>
                </select>
              </div>
              <div><label>Cabin</label>
                <select value={findState.cabin} onChange={e=>setFind({...findState, cabin:e.target.value})}>
                  <option>ECONOMY</option><option>PREMIUM_ECONOMY</option><option>BUSINESS</option><option>FIRST</option>
                </select>
              </div>
            </div>

            <div className="row" style={{marginTop:10}}>
              <div><label>Max stops</label>
                <select value={String(findState.maxStops)} onChange={e=>setFind({...findState, maxStops: (e.target.value==="null"?null:Number(e.target.value)) as any})}>
                  <option value="null">Any</option>
                  <option value="0">Non-stop only</option>
                </select>
              </div>
              <div><label>Airlines (allow / block)</label>
                <input placeholder="Allow e.g. DL,UA (comma)" value={findState.allowCarriers} onChange={e=>setFind({...findState, allowCarriers:e.target.value})}/>
                <input placeholder="Block e.g. F9,B6 (comma)" value={findState.blockCarriers} onChange={e=>setFind({...findState, blockCarriers:e.target.value})}/>
              </div>
            </div>

            <div style={{display:"flex", gap:16, marginTop:10, alignItems:"center"}}>
              <label><input type="checkbox" checked={findState.nearby} onChange={e=>setFind({...findState, nearby:e.target.checked})}/> include nearby airports</label>
              <label><input type="checkbox" checked={findState.flightsOnly} onChange={e=>setFind({...findState, flightsOnly:e.target.checked})}/> flights only</label>
              <label><input type="checkbox" checked={findState.includeHotels} onChange={e=>setFind({...findState, includeHotels:e.target.checked, flightsOnly:false})}/> include hotels</label>
              <label><input type="checkbox" checked={findState.includeCars} onChange={e=>setFind({...findState, includeCars:e.target.checked, flightsOnly:false})}/> include cars</label>
              <label><input type="checkbox" checked={findState.mistake} onChange={e=>setFind({...findState, mistake:e.target.checked})}/> prefer mistake fares</label>
            </div>

            <button className="cta" style={{marginTop:14}} onClick={findDeal}>🎯 Find My Deal</button>

            {summary && <div className="muted" style={{marginTop:10, whiteSpace:"pre-wrap"}}>{summary}</div>}
            <div className="grid">
              {results.length===0 && <div className="card" style={{gridColumn:"1/-1", textAlign:"center"}}>No results yet.</div>}
              {results.map((o,i)=>(
                <article key={i} className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <h3 style={{margin:0}}>${o.priceUSD?.toFixed?.(0) ?? o.priceUSD} {findState.currency}</h3>
                    <span className="badge">{o.tier==="unicorn"?"🦄 mistake-fare-like":o.tier==="great"?"🔥 great":o.tier==="cheap"?"✅ cheap":"—"}</span>
                  </div>
                  <div className="muted" style={{fontSize:12, marginTop:4}}>
                    CPM ~${(o.cpm||0).toFixed(2)}/mile {o.validatingAirline?`• ${o.validatingAirline}`:""} {o._route?`• ${o._route}`:""} {o._dates?`• ${o._dates}`:""}
                  </div>
                  <div style={{marginTop:6}}>
                    {(o.itineraries||[]).flatMap((it:any)=>it.segments||[]).map((s:any,idx:number)=>(
                      <span key={idx}>{s.from}→{s.to}{idx<(o.itineraries[0].segments.length-1)?" · ":""}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {/* flights/hotels/cars panes can reuse your earlier forms and call /api/travel/flights/search, /hotels/search, /cars/search */}
      </main>
    </div>
  );
}