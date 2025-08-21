// Travel Hacker AI Pro - Integrated with Advanta AI Platform
// Drop-in React page for "Travel Hacker AI" — one search for Flights (incl. mistake fares), Hotels, and Car Rentals
// ✅ Out-of-the-box: works with MOCK data so you can preview instantly
// 🔌 Plug real APIs by adding keys; the code will automatically switch to live providers
// 🧠 Includes DealRank™ scoring, TrueTotal™ cost rollups, Mistake Fare Radar, bundles, calendar heatmap, and AI explanations

import React, { useMemo, useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';

// -----------------------------
// Types
// -----------------------------
type AirportCode = string; // e.g., "BOS", "TPA"

interface SearchParams {
  origins: AirportCode[]; // allow multi-airport origin radius in future
  destination: string; // airport code or city string ("TPA" or "Tampa")
  departDate: string; // YYYY-MM-DD
  nights: number; // 1..14 (typical short trips)
  flexDays: number; // ± days around departDate to test
  adults: number;
  cabin: "economy" | "premium" | "business" | "first";
  includeHotels: boolean;
  includeCars: boolean;
}

interface FlightLeg {
  from: AirportCode;
  to: AirportCode;
  depart: string; // ISO
  arrive: string; // ISO
  flightNumber: string;
  airline: string; // IATA airline code
  aircraft?: string;
  durationMin: number;
}

interface FlightOption {
  id: string;
  price: number; // base flight price (cash)
  currency: string; // e.g., USD
  legs: FlightLeg[];
  fareBrand: "basic" | "standard" | "flex";
  bagIncluded: boolean; // e.g., 1 carry-on included?
  seatPitch?: number; // inches if known
  onTimeScore?: number; // 0..1
  provider: "MOCK" | "KIWI" | "AMADEUS" | "OTHER";
}

interface HotelOption {
  id: string;
  name: string;
  stars?: number;
  nightlyBase: number; // base nightly rate
  taxesFeesNight: number; // taxes and fees per night
  resortFeeNight?: number; // resort/cleaning fee per night
  parkingNight?: number;
  walkToCenterMin?: number;
  provider: "MOCK" | "AMADEUS" | "OTHER";
}

interface CarOption {
  id: string;
  vendor: string; // e.g., Alamo
  carClass: string; // e.g., Midsize
  baseTotal: number; // base rental total for trip
  airportFacilityFee?: number;
  concessionRecoveryFee?: number;
  oneWayDropFee?: number;
  counterless?: boolean;
  offAirportShuttleMin?: number; // if off-airport pickup
  provider: "MOCK" | "AMADEUS" | "OTHER";
}

interface Bundle {
  flight: FlightOption;
  hotel?: HotelOption;
  car?: CarOption;
  trueTotal: number;
  dealRank: number; // 0..100
  badges: string[];
}

// -----------------------------
// Config & helpers
// -----------------------------
const CURRENCY = "USD";

// Seat fee estimate probabilities by fare brand (very rough heuristic)
const SEAT_FEE_EST = {
  basic: { probability: 0.8, amount: 25 },
  standard: { probability: 0.35, amount: 18 },
  flex: { probability: 0.1, amount: 0 },
};

// Bag fee estimates (carry-on/checked) — simplified; adjust per airline/route in production
const BAG_FEE_EST = {
  basic: { carryOn: 35, checked: 35 },
  standard: { carryOn: 0, checked: 35 },
  flex: { carryOn: 0, checked: 0 },
};

function currency(n: number, currency = CURRENCY) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
}

function minutesToHHMM(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function totalDuration(legs: FlightLeg[]) {
  return legs.reduce((acc, l) => acc + l.durationMin, 0);
}

function connectionRisk(legs: FlightLeg[]) {
  // Minimal mock: more than one leg increases risk; short turns add risk
  if (legs.length <= 1) return 0.1;
  const connections = legs.length - 1;
  const penalty = 0.15 * connections;
  return Math.min(1, 0.1 + penalty);
}

function comfortScore(f: FlightOption) {
  // very basic heuristic: higher seat pitch & better on-time increases score
  const pitch = f.seatPitch ?? 31;
  const onTime = f.onTimeScore ?? 0.7;
  const pitchScore = Math.min(1, Math.max(0, (pitch - 28) / 10)); // 28"->0, 38"->1
  return (pitchScore * 0.6 + onTime * 0.4);
}

function estimateFlightExtras(f: FlightOption, adults: number) {
  const bag = BAG_FEE_EST[f.fareBrand].carryOn * adults; // simple: carry-on only
  const seat = SEAT_FEE_EST[f.fareBrand].probability * SEAT_FEE_EST[f.fareBrand].amount * adults;
  return Math.round(bag + seat);
}

function hotelTrueTotal(h: HotelOption, nights: number) {
  const base = h.nightlyBase * nights;
  const taxes = h.taxesFeesNight * nights;
  const resort = (h.resortFeeNight ?? 0) * nights;
  const parking = (h.parkingNight ?? 0) * nights;
  return Math.round(base + taxes + resort + parking);
}

function carTrueTotal(c: CarOption) {
  return Math.round((c.baseTotal || 0) + (c.airportFacilityFee ?? 0) + (c.concessionRecoveryFee ?? 0) + (c.oneWayDropFee ?? 0));
}

function trueTotalFlight(f: FlightOption, adults: number) {
  return Math.round(f.price + estimateFlightExtras(f, adults));
}

function detectMistakeFare(f: FlightOption, expectedPrice: number) {
  // If price < 55% of expected baseline, flag as likely mistake fare
  if (f.price <= expectedPrice * 0.55) return { likely: true, severity: "high" };
  if (f.price <= expectedPrice * 0.7) return { likely: true, severity: "medium" };
  return { likely: false, severity: "low" };
}

function naiveExpectedPrice(legs: FlightLeg[], cabin: SearchParams["cabin"]) {
  // In practice, derive from historical OD medians. Here we rough estimate from total minutes.
  const hours = totalDuration(legs) / 60;
  const basePerHour = cabin === "economy" ? 70 : cabin === "premium" ? 110 : cabin === "business" ? 200 : 310;
  return hours * basePerHour;
}

function dealRankScore(args: {
  trueTotal: number;
  flight: FlightOption;
  hotel?: HotelOption;
  car?: CarOption;
  referencePrice: number; // for normalization
}) {
  const { trueTotal, flight, hotel, car, referencePrice } = args;

  // Normalize price: lower is better
  const priceNorm = Math.min(1, Math.max(0, referencePrice / Math.max(trueTotal, 1)));

  // Time & risk from flight
  const timePenalty = Math.min(1, totalDuration(flight.legs) / (12 * 60)); // 12h = 1.0
  const connRisk = connectionRisk(flight.legs); // 0..1 higher worse
  const comfort = comfortScore(flight); // 0..1 higher better

  // Hotel location heuristic: shorter walk-to-center is better
  const walk = hotel?.walkToCenterMin ?? 20;
  const walkNorm = Math.min(1, Math.max(0, (30 - walk) / 30)); // 0..1

  // Car friction
  const carFriction = (car?.offAirportShuttleMin ?? 0) > 0 ? 0.2 : 0;
  const counterlessBoost = car?.counterless ? 0.05 : 0;

  // Weighted composite (tweak to taste)
  const score =
    100 * (
      0.42 * priceNorm +
      0.18 * (1 - timePenalty) +
      0.14 * (1 - connRisk) +
      0.14 * comfort +
      0.08 * walkNorm +
      0.04 * (0.05 + counterlessBoost - carFriction)
    );

  return Math.round(Math.min(100, Math.max(0, score)));
}

// -----------------------------
// Providers — Client now calls your secure Next.js API routes
// -----------------------------

async function fetchFlights(params: SearchParams): Promise<FlightOption[]> {
  try {
    const res = await fetch('/api/flights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return (data?.flights || []) as FlightOption[];
  } catch (e) {
    console.warn('Flights API failed, falling back to MOCK', e);
    return fetchFlightsMOCK(params);
  }
}

async function fetchHotels(params: SearchParams): Promise<HotelOption[]> {
  try {
    const res = await fetch('/api/hotels', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return (data?.hotels || []) as HotelOption[];
  } catch (e) {
    console.warn('Hotels API failed, falling back to MOCK', e);
    return fetchHotelsMOCK(params);
  }
}

async function fetchCars(params: SearchParams): Promise<CarOption[]> {
  try {
    const res = await fetch('/api/cars', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return (data?.cars || []) as CarOption[];
  } catch (e) {
    console.warn('Cars API failed, falling back to MOCK', e);
    return fetchCarsMOCK(params);
  }
}

// ---- MOCK data so you can demo instantly ----
async function fetchFlightsMOCK(p: SearchParams): Promise<FlightOption[]> {
  const sample: FlightOption[] = [
    {
      id: "F1",
      price: 138,
      currency: CURRENCY,
      legs: [
        { from: p.origins[0] || "BOS", to: p.destination || "TPA", depart: `${p.departDate}T07:10:00`, arrive: `${p.departDate}T10:12:00`, flightNumber: "NK123", airline: "NK", durationMin: 182, aircraft: "A320" },
      ],
      fareBrand: "basic",
      bagIncluded: false,
      seatPitch: 28,
      onTimeScore: 0.65,
      provider: "MOCK",
    },
    {
      id: "F2",
      price: 189,
      currency: CURRENCY,
      legs: [
        { from: p.origins[0] || "BOS", to: p.destination || "TPA", depart: `${p.departDate}T09:00:00`, arrive: `${p.departDate}T12:00:00`, flightNumber: "DL456", airline: "DL", durationMin: 180, aircraft: "737-900" },
      ],
      fareBrand: "standard",
      bagIncluded: true,
      seatPitch: 31,
      onTimeScore: 0.8,
      provider: "MOCK",
    },
    {
      id: "F3",
      price: 260,
      currency: CURRENCY,
      legs: [
        { from: p.origins[0] || "BOS", to: p.destination || "ATL", depart: `${p.departDate}T12:30:00`, arrive: `${p.departDate}T14:20:00`, flightNumber: "DL789", airline: "DL", durationMin: 110 },
        { from: "ATL", to: p.destination || "TPA", depart: `${p.departDate}T16:10:00`, arrive: `${p.departDate}T17:43:00`, flightNumber: "DL101", airline: "DL", durationMin: 93 },
      ],
      fareBrand: "flex",
      bagIncluded: true,
      seatPitch: 32,
      onTimeScore: 0.88,
      provider: "MOCK",
    },
  ];
  return sample;
}

async function fetchHotelsMOCK(p: SearchParams): Promise<HotelOption[]> {
  const nights = p.nights || 2;
  return [
    { id: "H1", name: "Harbourview Suites", stars: 4, nightlyBase: 129, taxesFeesNight: 22, resortFeeNight: 15, parkingNight: 25, walkToCenterMin: 10, provider: "MOCK" },
    { id: "H2", name: "Downtown Modern", stars: 4.5, nightlyBase: 149, taxesFeesNight: 28, resortFeeNight: 0, parkingNight: 35, walkToCenterMin: 6, provider: "MOCK" },
    { id: "H3", name: "Seabreeze Tower", stars: 4, nightlyBase: 115, taxesFeesNight: 20, resortFeeNight: 25, parkingNight: 20, walkToCenterMin: 14, provider: "MOCK" },
  ];
}

async function fetchCarsMOCK(p: SearchParams): Promise<CarOption[]> {
  return [
    { id: "C1", vendor: "Alamo", carClass: "Midsize", baseTotal: 78, airportFacilityFee: 12, concessionRecoveryFee: 9, counterless: true, provider: "MOCK" },
    { id: "C2", vendor: "Avis", carClass: "Compact", baseTotal: 69, airportFacilityFee: 12, concessionRecoveryFee: 9, offAirportShuttleMin: 8, provider: "MOCK" },
  ];
}

// -----------------------------
// AI helper (OpenAI) — optional explanation of why a deal ranks well
// -----------------------------
async function aiExplainDeal(bundle: Bundle): Promise<string> {
  const key = (process.env.NEXT_PUBLIC_OPENAI_API_KEY || (globalThis as any).OPENAI_API_KEY) as string | undefined;
  if (!key) {
    // Fallback explanation without external API
    return `Strong value: ${bundle.flight.legs.length > 1 ? "balanced connections" : "nonstop"}, good comfort, and low total cost ${currency(bundle.trueTotal)}.`;
  }

  try {
    const prompt = `You are a travel deal explainer. In one short sentence, explain why this bundle is good. Use plain English, avoid jargon.\n\nFlight price: ${currency(bundle.flight.price)}. Flight legs: ${bundle.flight.legs.length}. Total duration: ${minutesToHHMM(totalDuration(bundle.flight.legs))}. Fare brand: ${bundle.flight.fareBrand}. Seat pitch: ${bundle.flight.seatPitch || 31}.\nHotel set: ${bundle.hotel ? `${bundle.hotel.name} (~${bundle.hotel.stars || 4}★)` : "none"}.\nCar set: ${bundle.car ? `${bundle.car.vendor} ${bundle.car.carClass}` : "none"}.\nTrueTotal: ${currency(bundle.trueTotal)}. DealRank: ${bundle.dealRank}.\n`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Be concise and helpful." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 70,
      }),
    });
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || "Great overall value given time, comfort, and cost.";
  } catch (e) {
    return "Great overall value given time, comfort, and cost.";
  }
}

// -----------------------------
// UI Components
// -----------------------------
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">{children}</span>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="mb-2 text-sm font-semibold text-gray-700">{title}</div>
      <div className="rounded-2xl border p-3 sm:p-4 shadow-sm overflow-hidden">{children}</div>
    </section>
  );
}

function CalendarHeatmap({ days = 14, basePrice = 200, onPick }: { days?: number; basePrice?: number; onPick: (dateStr: string) => void }) {
  const start = new Date();
  const cells = Array.from({ length: days }).map((_, i) => {
    const d = new Date(start.getTime() + i * 86400000);
    const iso = d.toISOString().slice(0, 10);
    const factor = 0.8 + Math.sin(i / 2) * 0.2 + (i % 5 === 0 ? -0.1 : 0) + (i % 7 === 0 ? 0.1 : 0);
    const price = Math.max(89, Math.round(basePrice * factor));
    return { iso, price };
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-3 gap-1.5 min-w-fit sm:grid-cols-4 sm:gap-2 md:grid-cols-7">
        {cells.map(({ iso, price }) => (
          <button key={iso} onClick={() => onPick(iso)} className="min-w-[90px] sm:min-w-[100px] rounded-lg border p-2 text-left hover:shadow-md transition-shadow">
            <div className="text-xs text-gray-500 truncate">{new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div className="text-sm font-semibold truncate">{currency(price)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FlightCard({ f, adults, selected, onSelect, cabin }: { f: FlightOption; adults: number; selected?: boolean; onSelect: () => void; cabin: SearchParams["cabin"]; }) {
  const expected = useMemo(() => naiveExpectedPrice(f.legs, cabin), [f, cabin]);
  const mf = detectMistakeFare(f, expected);
  const extras = estimateFlightExtras(f, adults);
  const ttf = trueTotalFlight(f, adults);
  const totalMins = totalDuration(f.legs);
  return (
    <div className={`rounded-2xl border p-4 hover:shadow ${selected ? "ring-2 ring-indigo-500" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="text-sm text-gray-600">{f.legs.map((l, i) => (
            <span key={i}>{l.from}→{l.to}{i < f.legs.length - 1 ? ", " : ""}</span>
          ))}</div>
          <div className="text-xs text-gray-500">{minutesToHHMM(totalMins)} · {f.legs.length > 1 ? `${f.legs.length - 1} stop` : "nonstop"} · {f.legs[0].airline}</div>
          <div className="flex flex-wrap gap-2 pt-1">
            {!f.bagIncluded && <Badge>No carry‑on</Badge>}
            <Badge>Fare: {f.fareBrand}</Badge>
            {f.seatPitch && <Badge>{f.seatPitch}" legroom</Badge>}
            {mf.likely && <Badge>⚡ Mistake fare {mf.severity}</Badge>}
          </div>
        </div>
        <div className="text-right sm:text-right">
          <div className="text-lg font-bold">{currency(f.price)}</div>
          <div className="text-xs text-gray-500">Extras est. {currency(extras)}</div>
          <div className="text-sm">TrueTotal {currency(ttf)}</div>
          <button onClick={onSelect} className="mt-2 w-full sm:w-auto rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">{selected ? "Selected" : "Select"}</button>
        </div>
      </div>
    </div>
  );
}

function HotelCard({ h, nights, selected, onSelect }: { h: HotelOption; nights: number; selected?: boolean; onSelect: () => void; }) {
  const tt = hotelTrueTotal(h, nights);
  return (
    <div className={`rounded-2xl border p-4 hover:shadow ${selected ? "ring-2 ring-emerald-500" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1">
          <div className="font-medium">{h.name}</div>
          <div className="text-xs text-gray-500">{h.stars || 4}★ · {h.walkToCenterMin ?? 10} min to center</div>
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            {h.resortFeeNight ? <Badge>Resort fee incl.</Badge> : <Badge>No resort fee</Badge>}
            {h.parkingNight ? <Badge>Parking: {currency(h.parkingNight)}/night</Badge> : <Badge>No parking fee</Badge>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm">Nightly {currency(h.nightlyBase)}</div>
          <div className="text-xs text-gray-500">Taxes/fees {currency(h.taxesFeesNight)}/night</div>
          <div className="text-sm font-semibold">TrueTotal {currency(tt)}</div>
          <button onClick={onSelect} className="mt-2 w-full sm:w-auto rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">{selected ? "Selected" : "Select"}</button>
        </div>
      </div>
    </div>
  );
}

function CarCard({ c, selected, onSelect }: { c: CarOption; selected?: boolean; onSelect: () => void; }) {
  const tt = carTrueTotal(c);
  return (
    <div className={`rounded-2xl border p-4 hover:shadow ${selected ? "ring-2 ring-amber-500" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">{c.vendor} · {c.carClass}</div>
          <div className="text-xs text-gray-500">{c.counterless ? "Counterless pickup" : c.offAirportShuttleMin ? `Off-airport + shuttle ${c.offAirportShuttleMin}m` : "Airport counter"}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">TrueTotal {currency(tt)}</div>
          <button onClick={onSelect} className="mt-2 rounded-xl bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700">{selected ? "Selected" : "Select"}</button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Main Page Component
// -----------------------------
export default function TravelHackerPro() {
  const [params, setParams] = useState<SearchParams>({
    origins: ["BOS"],
    destination: "TPA",
    departDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    nights: 2,
    flexDays: 2,
    adults: 1,
    cabin: "economy",
    includeHotels: true,
    includeCars: true,
  });

  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [cars, setCars] = useState<CarOption[]>([]);

  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [aiText, setAiText] = useState<string>("");

  async function runSearch() {
    setLoading(true);
    setAiText("");
    try {
      const [F, H, C] = await Promise.all([
        fetchFlights(params),
        params.includeHotels ? fetchHotels(params) : Promise.resolve([]),
        params.includeCars ? fetchCars(params) : Promise.resolve([]),
      ]);
      setFlights(F);
      setHotels(H as HotelOption[]);
      setCars(C as CarOption[]);
      setSelectedFlight(F[1]?.id || F[0]?.id || null);
      setSelectedHotel((H as HotelOption[])[0]?.id || null);
      setSelectedCar((C as CarOption[])[0]?.id || null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // auto-run initial search on mount
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Recompute bundles when selections or lists change
    const f = flights.find((x) => x.id === selectedFlight);
    if (!f) return setBundles([]);

    const hotelSet = params.includeHotels ? hotels : [undefined];
    const carSet = params.includeCars ? cars : [undefined];

    const expected = naiveExpectedPrice(f.legs, params.cabin);
    const referencePrice = Math.max(trueTotalFlight(f, params.adults) + (hotelSet[0] ? hotelTrueTotal(hotelSet[0] as HotelOption, params.nights) : 0) + (carSet[0] ? carTrueTotal(carSet[0] as CarOption) : 0), 1);

    const combos: Bundle[] = [];
    (hotelSet as (HotelOption | undefined)[]).slice(0, 3).forEach((h) => {
      (carSet as (CarOption | undefined)[]).slice(0, 2).forEach((c) => {
        const tt = trueTotalFlight(f, params.adults) + (h ? hotelTrueTotal(h, params.nights) : 0) + (c ? carTrueTotal(c) : 0);
        const dr = dealRankScore({ trueTotal: tt, flight: f, hotel: h, car: c, referencePrice });
        const badges: string[] = [];
        const mf = detectMistakeFare(f, expected);
        if (mf.likely) badges.push("Mistake fare candidate");
        if (f.legs.length === 1) badges.push("Nonstop");
        if (h && !h.resortFeeNight) badges.push("No resort fee");
        if (c?.counterless) badges.push("Counterless pickup");
        combos.push({ flight: f, hotel: h, car: c, trueTotal: tt, dealRank: dr, badges });
      });
    });
    combos.sort((a, b) => b.dealRank - a.dealRank);
    setBundles(combos);
  }, [flights, hotels, cars, selectedFlight, params, selectedHotel, selectedCar]);

  async function handleExplain(b: Bundle) {
    const text = await aiExplainDeal(b);
    setAiText(text);
  }

  const selectedFlightObj = flights.find((x) => x.id === selectedFlight) || null;

  return (
    <>
      <Helmet>
        <title>Travel Hacker AI Pro - Advanced Travel Planning | Advanta AI</title>
        <meta name="description" content="Advanced AI-powered travel planning with TrueTotal™ pricing, DealRank™ scoring, and Mistake Fare Radar. Find the best flight, hotel, and car rental combinations." />
        <meta property="og:title" content="Travel Hacker AI Pro - Advanced Travel Planning" />
        <meta property="og:description" content="Advanced AI-powered travel planning with TrueTotal™ pricing, DealRank™ scoring, and Mistake Fare Radar." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <NewHeader />
        
        <div className="mx-auto max-w-7xl px-4 py-6">
          <header className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">Travel Hacker AI Pro</h1>
            <p className="text-sm text-gray-600">One search for flights, mistake fares, hotels, and cars — with TrueTotal™ pricing & DealRank™.</p>
          </header>

          {/* Search controls */}
          <Section title="Search">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
              <div className="sm:col-span-1 lg:col-span-2">
                <label className="text-xs text-gray-600">From (IATA)</label>
                <input className="w-full rounded-xl border p-2 text-sm" value={params.origins.join(",")} onChange={(e) => setParams((s) => ({ ...s, origins: e.target.value.split(",").map((x) => x.trim().toUpperCase()).filter(Boolean) }))} />
              </div>
              <div className="sm:col-span-1 lg:col-span-2">
                <label className="text-xs text-gray-600">To (IATA/City)</label>
                <input className="w-full rounded-xl border p-2 text-sm" value={params.destination} onChange={(e) => setParams((s) => ({ ...s, destination: e.target.value.toUpperCase() }))} />
              </div>
              <div className="sm:col-span-1 lg:col-span-2">
                <label className="text-xs text-gray-600">Depart</label>
                <input type="date" className="w-full rounded-xl border p-2 text-sm" value={params.departDate} onChange={(e) => setParams((s) => ({ ...s, departDate: e.target.value }))} />
              </div>
              <div className="sm:col-span-1 lg:col-span-1">
                <label className="text-xs text-gray-600">Nights</label>
                <input type="number" min={1} max={14} className="w-full rounded-xl border p-2 text-sm" value={params.nights} onChange={(e) => setParams((s) => ({ ...s, nights: Number(e.target.value) }))} />
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <label className="text-xs text-gray-600">Flex (± days)</label>
                <input type="range" min={0} max={7} value={params.flexDays} onChange={(e) => setParams((s) => ({ ...s, flexDays: Number(e.target.value) }))} className="w-full" />
                <div className="text-xs text-gray-600">± {params.flexDays} days</div>
              </div>
              <div className="sm:col-span-1 lg:col-span-1">
                <label className="text-xs text-gray-600">Adults</label>
                <input type="number" min={1} max={8} className="w-full rounded-xl border p-2 text-sm" value={params.adults} onChange={(e) => setParams((s) => ({ ...s, adults: Number(e.target.value) }))} />
              </div>
              <div className="sm:col-span-1 lg:col-span-2">
                <label className="text-xs text-gray-600">Cabin</label>
                <select className="w-full rounded-xl border p-2 text-sm" value={params.cabin} onChange={(e) => setParams((s) => ({ ...s, cabin: e.target.value as any }))}>
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={params.includeHotels} onChange={(e) => setParams((s) => ({ ...s, includeHotels: e.target.checked }))} /> Include hotels</label>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={params.includeCars} onChange={(e) => setParams((s) => ({ ...s, includeCars: e.target.checked }))} /> Include cars</label>
              <button onClick={runSearch} disabled={loading} className="w-full sm:w-auto sm:ml-auto rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-900 disabled:opacity-50">{loading ? "Searching…" : "Search"}</button>
            </div>
          </Section>

          {/* Flex calendar */}
          <Section title="Date Flex Heatmap (TrueTotal trend)">
            <CalendarHeatmap days={14} basePrice={selectedFlightObj ? trueTotalFlight(selectedFlightObj, params.adults) : 200} onPick={(iso) => setParams((s) => ({ ...s, departDate: iso }))} />
          </Section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Flights */}
            <div className="lg:col-span-6">
              <Section title="Flights">
                <div className="space-y-3">
                  {flights.map((f) => (
                    <FlightCard key={f.id} f={f} adults={params.adults} cabin={params.cabin} selected={selectedFlight === f.id} onSelect={() => setSelectedFlight(f.id)} />
                  ))}
                  {flights.length === 0 && <div className="text-sm text-gray-600">No flights yet. Try different dates or airports.</div>}
                </div>
              </Section>
            </div>

            {/* Hotels */}
            <div className="lg:col-span-3">
              <Section title="Hotels">
                {params.includeHotels ? (
                  <div className="space-y-3">
                    {hotels.map((h) => (
                      <HotelCard key={h.id} h={h} nights={params.nights} selected={selectedHotel === h.id} onSelect={() => setSelectedHotel(h.id)} />
                    ))}
                    {hotels.length === 0 && <div className="text-sm text-gray-600">No hotels found.</div>}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">Hotels not included.</div>
                )}
              </Section>
            </div>

            {/* Cars */}
            <div className="lg:col-span-3">
              <Section title="Cars">
                {params.includeCars ? (
                  <div className="space-y-3">
                    {cars.map((c) => (
                      <CarCard key={c.id} c={c} selected={selectedCar === c.id} onSelect={() => setSelectedCar(c.id)} />
                    ))}
                    {cars.length === 0 && <div className="text-sm text-gray-600">No cars found.</div>}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">Cars not included.</div>
                )}
              </Section>
            </div>
          </div>

          {/* Bundles */}
          <Section title="Best Combos (DealRank™)">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {bundles.slice(0, 6).map((b, i) => (
                <div key={i} className="rounded-2xl border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm font-semibold">DealRank <span className="rounded-lg bg-indigo-50 px-2 py-0.5">{b.dealRank}</span></div>
                    <div className="text-sm font-bold">{currency(b.trueTotal)}</div>
                  </div>
                  <div className="text-xs text-gray-600">Flight {b.flight.legs.map((l, i2) => (<span key={i2}>{l.from}→{l.to}{i2 < b.flight.legs.length - 1 ? ", " : ""}</span>))}</div>
                  <div className="mt-1 text-xs text-gray-600">Hotel: {b.hotel ? b.hotel.name : "—"} · Car: {b.car ? `${b.car.vendor} ${b.car.carClass}` : "—"}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {b.badges.map((x, j) => (<Badge key={j}>{x}</Badge>))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => handleExplain(b)} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50">Why this?</button>
                    <button className="rounded-xl bg-black px-3 py-1.5 text-sm text-white hover:bg-gray-900">Select bundle</button>
                  </div>
                </div>
              ))}
            </div>
            {aiText && <div className="mt-3 rounded-xl border bg-yellow-50 p-3 text-sm">{aiText}</div>}
          </Section>

          <footer className="mt-10 text-center text-xs text-gray-500">© {new Date().getFullYear()} Travel Hacker AI Pro · Powered by Advanta AI</footer>
        </div>
        
        <Footer />
      </div>
    </>
  );
}