import React, { useMemo, useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

// Types
type AirportCode = string;

interface SearchParams {
  origins: AirportCode[];
  destination: string;
  departDate: string;
  nights: number;
  flexDays: number;
  adults: number;
  cabin: "economy" | "premium" | "business" | "first";
  includeHotels: boolean;
  includeCars: boolean;
}

interface FlightLeg {
  from: AirportCode;
  to: AirportCode;
  depart: string;
  arrive: string;
  flightNumber: string;
  airline: string;
  aircraft?: string;
  durationMin: number;
}

interface FlightOption {
  id: string;
  price: number;
  currency: string;
  legs: FlightLeg[];
  fareBrand: "basic" | "standard" | "flex";
  bagIncluded: boolean;
  seatPitch?: number;
  onTimeScore?: number;
  provider: "MOCK" | "KIWI" | "AMADEUS" | "OTHER";
}

interface HotelOption {
  id: string;
  name: string;
  stars?: number;
  nightlyBase: number;
  taxesFeesNight: number;
  resortFeeNight?: number;
  parkingNight?: number;
  walkToCenterMin?: number;
  provider: "MOCK" | "AMADEUS" | "OTHER";
}

interface CarOption {
  id: string;
  vendor: string;
  carClass: string;
  baseTotal: number;
  airportFacilityFee?: number;
  concessionRecoveryFee?: number;
  oneWayDropFee?: number;
  counterless?: boolean;
  offAirportShuttleMin?: number;
  provider: "MOCK" | "AMADEUS" | "OTHER";
}

interface Bundle {
  flight: FlightOption;
  hotel?: HotelOption;
  car?: CarOption;
  trueTotal: number;
  dealRank: number;
  badges: string[];
}

// Config & helpers
const CURRENCY = "USD";

const SEAT_FEE_EST = {
  basic: { probability: 0.8, amount: 25 },
  standard: { probability: 0.35, amount: 18 },
  flex: { probability: 0.1, amount: 0 },
};

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
  if (legs.length <= 1) return 0.1;
  const connections = legs.length - 1;
  const penalty = 0.15 * connections;
  return Math.min(1, 0.1 + penalty);
}

function comfortScore(f: FlightOption) {
  const pitch = f.seatPitch ?? 31;
  const onTime = f.onTimeScore ?? 0.7;
  const pitchScore = Math.min(1, Math.max(0, (pitch - 28) / 10));
  return (pitchScore * 0.6 + onTime * 0.4);
}

function estimateFlightExtras(f: FlightOption, adults: number) {
  const bag = BAG_FEE_EST[f.fareBrand].carryOn * adults;
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
  if (f.price <= expectedPrice * 0.55) return { likely: true, severity: "high" };
  if (f.price <= expectedPrice * 0.7) return { likely: true, severity: "medium" };
  return { likely: false, severity: "low" };
}

function naiveExpectedPrice(legs: FlightLeg[], cabin: SearchParams["cabin"]) {
  const hours = totalDuration(legs) / 60;
  const basePerHour = cabin === "economy" ? 70 : cabin === "premium" ? 110 : cabin === "business" ? 200 : 310;
  return hours * basePerHour;
}

function dealRankScore(args: {
  trueTotal: number;
  flight: FlightOption;
  hotel?: HotelOption;
  car?: CarOption;
  referencePrice: number;
}) {
  const { trueTotal, flight, hotel, car, referencePrice } = args;

  const priceNorm = Math.min(1, Math.max(0, referencePrice / Math.max(trueTotal, 1)));
  const timePenalty = Math.min(1, totalDuration(flight.legs) / (12 * 60));
  const connRisk = connectionRisk(flight.legs);
  const comfort = comfortScore(flight);
  const walk = hotel?.walkToCenterMin ?? 20;
  const walkNorm = Math.min(1, Math.max(0, (30 - walk) / 30));
  const carFriction = (car?.offAirportShuttleMin ?? 0) > 0 ? 0.2 : 0;
  const counterlessBoost = car?.counterless ? 0.05 : 0;

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

// Mock data generators for preview
function generateMockFlights(params: SearchParams): FlightOption[] {
  const mockFlights: FlightOption[] = [
    {
      id: "fl1",
      price: 234,
      currency: "USD",
      legs: [
        {
          from: "BOS",
          to: "TPA",
          depart: params.departDate + "T08:30:00Z",
          arrive: params.departDate + "T13:15:00Z",
          flightNumber: "B6 2187",
          airline: "B6",
          durationMin: 285,
        },
      ],
      fareBrand: "basic",
      bagIncluded: false,
      seatPitch: 32,
      onTimeScore: 0.85,
      provider: "MOCK",
    },
    {
      id: "fl2",
      price: 189,
      currency: "USD",
      legs: [
        {
          from: "BOS",
          to: "ATL",
          depart: params.departDate + "T06:15:00Z",
          arrive: params.departDate + "T09:30:00Z",
          flightNumber: "DL 1234",
          airline: "DL",
          durationMin: 195,
        },
        {
          from: "ATL",
          to: "TPA",
          depart: params.departDate + "T11:45:00Z",
          arrive: params.departDate + "T13:20:00Z",
          flightNumber: "DL 5678",
          airline: "DL",
          durationMin: 95,
        },
      ],
      fareBrand: "standard",
      bagIncluded: true,
      seatPitch: 31,
      onTimeScore: 0.78,
      provider: "MOCK",
    },
  ];
  return mockFlights;
}

function generateMockHotels(nights: number): HotelOption[] {
  return [
    {
      id: "h1",
      name: "Tampa Bay Hotel",
      stars: 4,
      nightlyBase: 129,
      taxesFeesNight: 18,
      resortFeeNight: 25,
      parkingNight: 12,
      walkToCenterMin: 8,
      provider: "MOCK",
    },
    {
      id: "h2",
      name: "Westshore Grand",
      stars: 3,
      nightlyBase: 89,
      taxesFeesNight: 12,
      walkToCenterMin: 15,
      provider: "MOCK",
    },
  ];
}

function generateMockCars(): CarOption[] {
  return [
    {
      id: "c1",
      vendor: "Alamo",
      carClass: "Midsize",
      baseTotal: 142,
      airportFacilityFee: 8,
      concessionRecoveryFee: 5,
      counterless: true,
      provider: "MOCK",
    },
    {
      id: "c2",
      vendor: "Enterprise",
      carClass: "Compact",
      baseTotal: 98,
      airportFacilityFee: 8,
      concessionRecoveryFee: 5,
      offAirportShuttleMin: 12,
      provider: "MOCK",
    },
  ];
}

// API Functions (using mock data for now)
async function fetchFlights(params: SearchParams): Promise<FlightOption[]> {
  // In production, this would call your /api/flights endpoint
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  return generateMockFlights(params);
}

async function fetchHotels(params: SearchParams): Promise<HotelOption[]> {
  if (!params.includeHotels) return [];
  await new Promise(resolve => setTimeout(resolve, 600));
  return generateMockHotels(params.nights);
}

async function fetchCars(params: SearchParams): Promise<CarOption[]> {
  if (!params.includeCars) return [];
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockCars();
}

async function aiExplainDeal(bundle: Bundle): Promise<string> {
  // Mock AI explanation
  return `Strong value: ${bundle.flight.legs.length > 1 ? "balanced connections" : "nonstop"}, good comfort, and competitive total cost ${currency(bundle.trueTotal)}.`;
}

// UI Components
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">{children}</span>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="mb-4 text-lg font-semibold text-gray-800">{title}</div>
      <div className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">{children}</div>
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
    <div className="grid grid-cols-7 gap-2">
      {cells.map(({ iso, price }) => (
        <button key={iso} onClick={() => onPick(iso)} className="rounded-xl border border-gray-200 p-3 text-left hover:shadow-md hover:border-blue-300 transition-all duration-200">
          <div className="text-xs text-gray-500">{new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          <div className="font-semibold text-blue-600">{currency(price)}</div>
        </button>
      ))}
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
    <div className={`rounded-2xl border p-6 hover:shadow-lg transition-all duration-200 ${selected ? "ring-2 ring-blue-500 border-blue-300" : "border-gray-200"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="text-sm font-medium text-gray-800">
            {f.legs.map((l, i) => (
              <span key={i}>{l.from}→{l.to}{i < f.legs.length - 1 ? ", " : ""}</span>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            {minutesToHHMM(totalMins)} · {f.legs.length > 1 ? `${f.legs.length - 1} stop` : "nonstop"} · {f.airline || f.legs[0].airline}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {!f.bagIncluded && <Badge>No carry‑on</Badge>}
            <Badge>Fare: {f.fareBrand}</Badge>
            {f.seatPitch && <Badge>{f.seatPitch}" legroom</Badge>}
            {mf.likely && <Badge>⚡ Mistake fare {mf.severity}</Badge>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{currency(f.price)}</div>
          <div className="text-xs text-gray-500">Extras est. {currency(extras)}</div>
          <div className="text-sm font-medium text-blue-600">TrueTotal™ {currency(ttf)}</div>
          <button 
            onClick={onSelect} 
            className={`mt-3 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              selected 
                ? "bg-blue-600 text-white" 
                : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {selected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
}

function HotelCard({ h, nights, selected, onSelect }: { h: HotelOption; nights: number; selected?: boolean; onSelect: () => void }) {
  const total = hotelTrueTotal(h, nights);
  
  return (
    <div className={`rounded-2xl border p-6 hover:shadow-lg transition-all duration-200 ${selected ? "ring-2 ring-blue-500 border-blue-300" : "border-gray-200"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="font-medium text-gray-900">{h.name}</div>
          <div className="flex items-center gap-2">
            {Array.from({ length: h.stars || 4 }).map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {h.walkToCenterMin ? `${h.walkToCenterMin} min walk to center` : "City center location"}
          </div>
          <div className="flex flex-wrap gap-2">
            {(h.resortFeeNight || 0) === 0 && <Badge>No resort fee</Badge>}
            {(h.parkingNight || 0) === 0 && <Badge>Free parking</Badge>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{currency(h.nightlyBase)}/night</div>
          <div className="text-xs text-gray-500">+ taxes & fees</div>
          <div className="text-sm font-medium text-blue-600">TrueTotal™ {currency(total)}</div>
          <button 
            onClick={onSelect} 
            className={`mt-3 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              selected 
                ? "bg-blue-600 text-white" 
                : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {selected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CarCard({ c, selected, onSelect }: { c: CarOption; selected?: boolean; onSelect: () => void }) {
  const total = carTrueTotal(c);
  
  return (
    <div className={`rounded-2xl border p-6 hover:shadow-lg transition-all duration-200 ${selected ? "ring-2 ring-blue-500 border-blue-300" : "border-gray-200"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="font-medium text-gray-900">{c.vendor} - {c.carClass}</div>
          <div className="text-sm text-gray-600">
            {c.offAirportShuttleMin ? `${c.offAirportShuttleMin} min shuttle` : "On-airport pickup"}
          </div>
          <div className="flex flex-wrap gap-2">
            {c.counterless && <Badge>Counterless pickup</Badge>}
            {!c.oneWayDropFee && <Badge>No drop fee</Badge>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{currency(c.baseTotal)}</div>
          <div className="text-xs text-gray-500">+ fees</div>
          <div className="text-sm font-medium text-blue-600">TrueTotal™ {currency(total)}</div>
          <button 
            onClick={onSelect} 
            className={`mt-3 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              selected 
                ? "bg-blue-600 text-white" 
                : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {selected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BundleCard({ bundle, onExplain }: { bundle: Bundle; onExplain: () => void }) {
  return (
    <div className="rounded-2xl border border-blue-200 p-6 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-lg font-bold text-gray-900">Deal Rank: {bundle.dealRank}/100</div>
            <div className="flex gap-1">
              {bundle.badges.map((badge, i) => (
                <Badge key={i}>{badge}</Badge>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Flight: {bundle.flight.legs.map(l => `${l.from}→${l.to}`).join(", ")}</div>
            {bundle.hotel && <div>Hotel: {bundle.hotel.name}</div>}
            {bundle.car && <div>Car: {bundle.car.vendor} {bundle.car.carClass}</div>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{currency(bundle.trueTotal)}</div>
          <div className="text-sm text-gray-500">TrueTotal™</div>
        </div>
      </div>
      <button 
        onClick={onExplain}
        className="w-full mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        AI Explain Deal
      </button>
    </div>
  );
}

// Main component
export default function TravelHackerPro() {
  const [params, setParams] = useState<SearchParams>({
    origins: ["BOS"],
    destination: "TPA",
    departDate: new Date().toISOString().slice(0, 10),
    nights: 3,
    flexDays: 3,
    adults: 1,
    cabin: "economy",
    includeHotels: true,
    includeCars: true,
  });

  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [cars, setCars] = useState<CarOption[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string>("");
  const [selectedHotel, setSelectedHotel] = useState<string>("");
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>("");

  const search = async () => {
    setLoading(true);
    try {
      const [flightResults, hotelResults, carResults] = await Promise.all([
        fetchFlights(params),
        fetchHotels(params),
        fetchCars(params),
      ]);
      
      setFlights(flightResults);
      setHotels(hotelResults);
      setCars(carResults);
      
      if (flightResults.length > 0) {
        setSelectedFlight(flightResults[0].id);
      }
      if (hotelResults.length > 0) {
        setSelectedHotel(hotelResults[0].id);
      }
      if (carResults.length > 0) {
        setSelectedCar(carResults[0].id);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBundles = () => {
    if (flights.length === 0) return;
    
    const newBundles: Bundle[] = [];
    const selectedFlightObj = flights.find(f => f.id === selectedFlight) || flights[0];
    const selectedHotelObj = params.includeHotels ? hotels.find(h => h.id === selectedHotel) : undefined;
    const selectedCarObj = params.includeCars ? cars.find(c => c.id === selectedCar) : undefined;
    
    // Calculate reference price for ranking
    const flightTotal = trueTotalFlight(selectedFlightObj, params.adults);
    const hotelTotal = selectedHotelObj ? hotelTrueTotal(selectedHotelObj, params.nights) : 0;
    const carTotal = selectedCarObj ? carTrueTotal(selectedCarObj) : 0;
    const trueTotal = flightTotal + hotelTotal + carTotal;
    const referencePrice = trueTotal * 1.2; // Use as reference for ranking

    // Generate badge
    const badges: string[] = [];
    if (selectedFlightObj.legs.length === 1) badges.push("Nonstop");
    if (selectedHotelObj && (selectedHotelObj.resortFeeNight || 0) === 0) badges.push("No resort fee");
    if (selectedCarObj?.counterless) badges.push("Counterless pickup");
    
    const expected = naiveExpectedPrice(selectedFlightObj.legs, params.cabin);
    const mf = detectMistakeFare(selectedFlightObj, expected);
    if (mf.likely) badges.push("Mistake fare candidate");

    const bundle: Bundle = {
      flight: selectedFlightObj,
      hotel: selectedHotelObj,
      car: selectedCarObj,
      trueTotal,
      dealRank: dealRankScore({
        trueTotal,
        flight: selectedFlightObj,
        hotel: selectedHotelObj,
        car: selectedCarObj,
        referencePrice,
      }),
      badges,
    };

    newBundles.push(bundle);
    setBundles(newBundles);
  };

  useEffect(() => {
    generateBundles();
  }, [selectedFlight, selectedHotel, selectedCar, flights, hotels, cars]);

  const handleExplainDeal = async (bundle: Bundle) => {
    setExplanation("Generating explanation...");
    try {
      const exp = await aiExplainDeal(bundle);
      setExplanation(exp);
    } catch (error) {
      setExplanation("Great overall value given time, comfort, and cost.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Travel Hacker AI Pro | Advanta AI</title>
        <meta 
          name="description" 
          content="Advanced AI-powered travel planning with TrueTotal™ pricing, DealRank™ scoring, and Mistake Fare Radar. Find the best flight, hotel, and car rental combinations."
        />
      </Helmet>
      
      <NewHeader />
      
      <main className="py-28 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center mb-12"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Travel Hacker <span className="text-blue-600">AI Pro</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Advanced AI-powered travel planning with TrueTotal™ pricing, DealRank™ scoring, and Mistake Fare Radar
            </motion.p>
          </motion.div>

          {/* Search Form */}
          <motion.div variants={fadeInUp} className="mb-12">
            <Section title="Search Parameters">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                  <input
                    type="text"
                    value={params.origins[0]}
                    onChange={(e) => setParams({...params, origins: [e.target.value]})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="BOS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    type="text"
                    value={params.destination}
                    onChange={(e) => setParams({...params, destination: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="TPA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Depart Date</label>
                  <input
                    type="date"
                    value={params.departDate}
                    onChange={(e) => setParams({...params, departDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nights</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={params.nights}
                    onChange={(e) => setParams({...params, nights: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                  <select
                    value={params.adults}
                    onChange={(e) => setParams({...params, adults: parseInt(e.target.value)})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cabin</label>
                  <select
                    value={params.cabin}
                    onChange={(e) => setParams({...params, cabin: e.target.value as any})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium</option>
                    <option value="business">Business</option>
                    <option value="first">First</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4 pt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={params.includeHotels}
                      onChange={(e) => setParams({...params, includeHotels: e.target.checked})}
                      className="mr-2"
                    />
                    Include Hotels
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={params.includeCars}
                      onChange={(e) => setParams({...params, includeCars: e.target.checked})}
                      className="mr-2"
                    />
                    Include Cars
                  </label>
                </div>
              </div>
              
              <button
                onClick={search}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search Travel Deals"}
              </button>
            </Section>
          </motion.div>

          {/* Flexible Date Calendar */}
          {flights.length > 0 && (
            <motion.div variants={fadeInUp} className="mb-12">
              <Section title="Flex-Date Heatmap">
                <CalendarHeatmap 
                  onPick={(date) => setParams({...params, departDate: date})}
                />
              </Section>
            </motion.div>
          )}

          {/* Results */}
          {flights.length > 0 && (
            <>
              {/* Flights */}
              <motion.div variants={fadeInUp} className="mb-12">
                <Section title="Flights with Mistake Fare Radar">
                  <div className="space-y-4">
                    {flights.map(flight => (
                      <FlightCard
                        key={flight.id}
                        f={flight}
                        adults={params.adults}
                        cabin={params.cabin}
                        selected={selectedFlight === flight.id}
                        onSelect={() => setSelectedFlight(flight.id)}
                      />
                    ))}
                  </div>
                </Section>
              </motion.div>

              {/* Hotels */}
              {params.includeHotels && hotels.length > 0 && (
                <motion.div variants={fadeInUp} className="mb-12">
                  <Section title="Hotels with TrueTotal™ Pricing">
                    <div className="space-y-4">
                      {hotels.map(hotel => (
                        <HotelCard
                          key={hotel.id}
                          h={hotel}
                          nights={params.nights}
                          selected={selectedHotel === hotel.id}
                          onSelect={() => setSelectedHotel(hotel.id)}
                        />
                      ))}
                    </div>
                  </Section>
                </motion.div>
              )}

              {/* Cars */}
              {params.includeCars && cars.length > 0 && (
                <motion.div variants={fadeInUp} className="mb-12">
                  <Section title="Car Rentals with Hidden Fee Calculator">
                    <div className="space-y-4">
                      {cars.map(car => (
                        <CarCard
                          key={car.id}
                          c={car}
                          selected={selectedCar === car.id}
                          onSelect={() => setSelectedCar(car.id)}
                        />
                      ))}
                    </div>
                  </Section>
                </motion.div>
              )}

              {/* Bundles */}
              {bundles.length > 0 && (
                <motion.div variants={fadeInUp} className="mb-12">
                  <Section title="AI-Optimized Travel Bundles">
                    <div className="space-y-6">
                      {bundles.map((bundle, i) => (
                        <BundleCard
                          key={i}
                          bundle={bundle}
                          onExplain={() => handleExplainDeal(bundle)}
                        />
                      ))}
                      {explanation && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="font-medium text-blue-900 mb-2">AI Explanation:</div>
                          <div className="text-blue-800">{explanation}</div>
                        </div>
                      )}
                    </div>
                  </Section>
                </motion.div>
              )}
            </>
          )}

          {/* Getting Started Message */}
          {flights.length === 0 && !loading && (
            <motion.div variants={fadeInUp} className="text-center py-12">
              <div className="text-gray-500 mb-4">
                Ready to find your next travel deal? Use the search form above to get started with AI-powered travel planning.
              </div>
              <div className="text-sm text-gray-400">
                Currently running on demo data. Connect live APIs for real-time pricing.
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}