"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Loader2, Sun, CloudRain, Users, DollarSign } from "lucide-react";
import ToolLayout, { ResultCard, BulletList } from "@/components/tools/ToolLayout";

const ratingColor: Record<string, string> = {
  "⭐⭐⭐⭐⭐": "bg-green-100 text-green-700 border-green-200",
  "⭐⭐⭐⭐": "bg-blue-100 text-blue-700 border-blue-200",
  "⭐⭐⭐": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "⭐⭐": "bg-orange-100 text-orange-700 border-orange-200",
  "⭐": "bg-red-100 text-red-700 border-red-200",
};
const priceColor: Record<string, string> = { Low: "text-green-600", Medium: "text-yellow-600", High: "text-orange-600", "Very High": "text-red-600" };
const crowdColor: Record<string, string> = { Low: "text-green-600", Medium: "text-yellow-600", High: "text-orange-600", "Very High": "text-red-600" };

export default function BestTimeToTravelPage() {
  const [form, setForm] = useState({ destination: "", priorities: "", travel_style: "general tourist", duration: "1-2 weeks", from_country: "USA" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/travel-best-time", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to get travel guide."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Best Time to Travel" description="Month-by-month travel guide — weather, crowds, prices, and events for any destination." icon={<Globe className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Destination *</label>
              <input value={form.destination} onChange={e => setForm(v => ({ ...v, destination: e.target.value }))} placeholder="e.g. Tokyo, Bali, Italy, New York" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Traveling From</label>
              <input value={form.from_country} onChange={e => setForm(v => ({ ...v, from_country: e.target.value }))} placeholder="e.g. USA, UK, Australia" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Your Priorities</label>
              <input value={form.priorities} onChange={e => setForm(v => ({ ...v, priorities: e.target.value }))} placeholder="e.g. great weather, low crowds, cheap flights" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Travel Style</label>
                <select value={form.travel_style} onChange={e => setForm(v => ({ ...v, travel_style: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["general tourist", "budget backpacker", "luxury traveler", "adventure seeker", "family travel", "digital nomad", "beach lover"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Trip Length</label>
                <select value={form.duration} onChange={e => setForm(v => ({ ...v, duration: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["long weekend", "1 week", "1-2 weeks", "2-3 weeks", "1 month+"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.destination} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</> : <><Globe className="w-4 h-4" />Get Travel Guide</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center min-h-64">
              <Globe className="w-14 h-14 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">Month-by-month guide will appear here</p>
              <p className="text-gray-300 text-sm mt-1">Weather · Crowds · Prices · Events · Budget estimates</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold text-blue-200 uppercase mb-1">📍 {result.destination}</p>
                <p className="text-sm text-blue-100">{result.overview}</p>
                {result.sweet_spot && (
                  <div className="mt-3 bg-white/20 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-white/70 uppercase mb-1">🎯 Sweet Spot</p>
                    <p className="font-bold">{result.sweet_spot.months}</p>
                    <p className="text-blue-100 text-sm">{result.sweet_spot.why}</p>
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                {result.best_months?.map((m: any, i: number) => (
                  <div key={i} className={`border rounded-2xl p-4 ${ratingColor[m.rating] || "bg-gray-50 border-gray-200 text-gray-700"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-lg">{m.month}</p>
                      <span className="text-sm">{m.rating}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div className="flex items-center gap-1"><Sun className="w-3.5 h-3.5" /><span>{m.weather}</span></div>
                      <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /><span className={crowdColor[m.crowds] || ""}>{m.crowds} crowds</span></div>
                      <div className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /><span className={priceColor[m.price_level] || ""}>{m.price_level} prices</span></div>
                    </div>
                    <div className="flex flex-wrap gap-1">{m.highlights?.map((h: string, j: number) => <span key={j} className="text-xs bg-white/60 rounded-full px-2 py-0.5">• {h}</span>)}</div>
                  </div>
                ))}
              </div>

              {result.worst_months?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-red-700 uppercase mb-3">⚠️ Months to Avoid</p>
                  <div className="space-y-2">{result.worst_months.map((m: any, i: number) => <div key={i} className="text-sm text-red-700"><strong>{m.month}:</strong> {m.reason}</div>)}</div>
                </div>
              )}

              {result.festivals_events?.length > 0 && (
                <ResultCard title="🎉 Festivals & Events">
                  <div className="space-y-2">{result.festivals_events.map((f: any, i: number) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap h-fit">{f.month}</span>
                      <div><p className="font-semibold text-gray-900">{f.name}</p><p className="text-gray-600 text-xs">{f.description}</p></div>
                    </div>
                  ))}</div>
                </ResultCard>
              )}

              {result.budget_estimate && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Budget", value: result.budget_estimate.budget, color: "bg-green-50 border-green-200 text-green-700" },
                    { label: "Mid-Range", value: result.budget_estimate.mid_range, color: "bg-blue-50 border-blue-200 text-blue-700" },
                    { label: "Luxury", value: result.budget_estimate.luxury, color: "bg-purple-50 border-purple-200 text-purple-700" },
                  ].map(b => (
                    <div key={b.label} className={`border rounded-xl p-3 text-center ${b.color}`}>
                      <p className="text-xs font-semibold uppercase mb-1">{b.label}</p>
                      <p className="font-bold text-sm">{b.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {result.packing_tips?.length > 0 && <ResultCard title="🧳 Packing Tips"><BulletList items={result.packing_tips} /></ResultCard>}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
