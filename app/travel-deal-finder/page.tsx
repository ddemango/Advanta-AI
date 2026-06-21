"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, DollarSign, Plane } from "lucide-react";
import ToolLayout, { ResultCard, BulletList } from "@/components/tools/ToolLayout";

const interests = ["Culture & History", "Beach & Relaxation", "Food & Cuisine", "Adventure & Hiking", "Nightlife", "Nature & Wildlife", "Art & Museums", "Shopping", "Wellness & Spa"];
const styles = ["Budget backpacker", "Budget-conscious but comfortable", "Mid-range traveler", "Luxury traveler", "Family travel"];

export default function TravelDealFinderPage() {
  const [form, setForm] = useState({ from_city: "", budget: "", travel_style: "Budget-conscious but comfortable", duration: "7-10 days", flexibility: "flexible on destination, somewhat flexible on dates", interests: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (i: string) => {
    const next = selectedInterests.includes(i) ? selectedInterests.filter(x => x !== i) : [...selectedInterests, i];
    setSelectedInterests(next);
    setForm(v => ({ ...v, interests: next.join(", ") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/travel-deal-finder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to find deals."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  const dealScoreColor: Record<string, string> = { "🔥🔥🔥": "text-red-500", "🔥🔥": "text-orange-500", "🔥": "text-yellow-500" };

  return (
    <ToolLayout title="Travel Deal Finder" description="Tell us your budget and vibe — get the best bang-for-your-buck destinations and deal strategies." icon={<MapPin className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Departing From *</label>
              <input value={form.from_city} onChange={e => setForm(v => ({ ...v, from_city: e.target.value }))} placeholder="e.g. New York, London, Sydney" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Total Budget Per Person *</label>
              <input value={form.budget} onChange={e => setForm(v => ({ ...v, budget: e.target.value }))} placeholder="e.g. $1,500, $3,000, $10,000" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Travel Interests</label>
              <div className="flex flex-wrap gap-2">
                {interests.map(i => (
                  <button key={i} type="button" onClick={() => toggleInterest(i)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedInterests.includes(i) ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>{i}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Travel Style</label>
              <div className="space-y-2">
                {styles.map(s => (
                  <button key={s} type="button" onClick={() => setForm(v => ({ ...v, travel_style: s }))} className={`w-full text-left text-xs px-3 py-2 rounded-xl border transition-colors ${form.travel_style === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Trip Length</label>
                <select value={form.duration} onChange={e => setForm(v => ({ ...v, duration: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["long weekend", "5-7 days", "7-10 days", "2 weeks", "3+ weeks"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Flexibility</label>
                <select value={form.flexibility} onChange={e => setForm(v => ({ ...v, flexibility: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["open to anything", "flexible on destination, somewhat flexible on dates", "flexible on dates only", "mostly fixed plans"].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.from_city || !form.budget} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Finding Best Deals...</> : <><MapPin className="w-4 h-4" />Find My Best Deals</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center min-h-64">
              <MapPin className="w-14 h-14 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">Your top 5 travel deals will appear here</p>
              <p className="text-gray-300 text-sm mt-1">Best value destinations + deal strategies + app recommendations</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="space-y-3">
                {result.top_destinations?.map((dest: any, i: number) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-black text-gray-900">#{i + 1}</span>
                          <h3 className="text-xl font-black text-gray-900">{dest.destination}</h3>
                          <span className="text-sm text-gray-500">{dest.country}</span>
                        </div>
                        <p className="text-xs text-gray-500">Best months: {dest.best_travel_months}</p>
                      </div>
                      <span className="text-xl">{dest.deal_score}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { label: "Total Est. Cost", value: dest.estimated_total_cost, icon: DollarSign },
                        { label: "Flight Est.", value: dest.flight_estimate, icon: Plane },
                        { label: "Hotel/Night", value: dest.hotel_per_night, icon: MapPin },
                      ].map(s => (
                        <div key={s.label} className="bg-gray-50 rounded-xl p-2 text-center">
                          <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                          <p className="font-bold text-gray-900 text-sm">{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 mb-3">
                      <p className="text-xs font-semibold text-green-600 mb-1">Why it's a great deal</p>
                      <p className="text-sm text-green-800">{dest.why_great_deal}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">{dest.highlights?.map((h: string, j: number) => <span key={j} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">• {h}</span>)}</div>
                  </div>
                ))}
              </div>

              {result.deal_strategies?.length > 0 && (
                <ResultCard title="💡 Deal Strategies">
                  <div className="space-y-3">{result.deal_strategies.map((s: any, i: number) => (
                    <div key={i} className="bg-blue-50 rounded-xl p-3">
                      <p className="font-semibold text-blue-900 text-sm">{s.strategy}</p>
                      <p className="text-xs text-blue-700 mt-1">{s.how_to}</p>
                      <p className="text-xs font-semibold text-green-600 mt-1">💰 {s.savings_potential}</p>
                    </div>
                  ))}</div>
                </ResultCard>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {result.apps_to_use?.length > 0 && (
                  <ResultCard title="📱 Best Apps to Use">
                    <div className="space-y-2">{result.apps_to_use.map((a: any, i: number) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="font-semibold text-gray-900 whitespace-nowrap">{a.name}:</span>
                        <span className="text-gray-600">{a.best_for}</span>
                      </div>
                    ))}</div>
                  </ResultCard>
                )}
                <div className="space-y-3">
                  {result.mistake_fares_tip && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-orange-700 uppercase mb-2">✈️ Mistake Fares</p>
                      <p className="text-sm text-orange-800">{result.mistake_fares_tip}</p>
                    </div>
                  )}
                  {result.credit_card_tip && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-purple-700 uppercase mb-2">💳 Credit Card Hack</p>
                      <p className="text-sm text-purple-800">{result.credit_card_tip}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
