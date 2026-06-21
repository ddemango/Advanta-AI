"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Loader2, Hotel, AlertTriangle, CheckCircle } from "lucide-react";
import ToolLayout, { ResultCard, BulletList } from "@/components/tools/ToolLayout";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function BestTimeToBookPage() {
  const [form, setForm] = useState({ destination: "", travel_month: "", book_type: "flights and hotels", flexibility: "somewhat flexible (±3 days)", from_city: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/best-time-to-book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to get booking advice."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Best Time to Book Flights & Hotels" description="Know exactly when to book to get the lowest prices — flights, hotels, and timing strategies." icon={<Plane className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Destination *</label>
              <input value={form.destination} onChange={e => setForm(v => ({ ...v, destination: e.target.value }))} placeholder="e.g. Paris, Cancun, Tokyo" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Departing From</label>
              <input value={form.from_city} onChange={e => setForm(v => ({ ...v, from_city: e.target.value }))} placeholder="e.g. New York, London, Los Angeles" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Month You Want to Travel *</label>
              <select value={form.travel_month} onChange={e => setForm(v => ({ ...v, travel_month: e.target.value }))} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select month...</option>
                {months.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Booking Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["flights only", "hotels only", "flights and hotels"].map(t => (
                  <button key={t} type="button" onClick={() => setForm(v => ({ ...v, book_type: t }))} className={`text-xs px-2 py-2 rounded-xl border transition-colors text-center ${form.book_type === t ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date Flexibility</label>
              <select value={form.flexibility} onChange={e => setForm(v => ({ ...v, flexibility: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {["no flexibility (exact dates)", "somewhat flexible (±3 days)", "flexible (±1 week)", "very flexible (±2 weeks)"].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.destination || !form.travel_month} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing Prices...</> : <><Plane className="w-4 h-4" />Get Booking Strategy</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center min-h-64">
              <Plane className="w-14 h-14 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">Your booking strategy will appear here</p>
              <p className="text-gray-300 text-sm mt-1">Best booking windows · Deal tools · Insider tips</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {result.savings_estimate && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
                  <p className="text-xs font-semibold text-green-200 uppercase mb-1">💰 Potential Savings</p>
                  <p className="text-2xl font-black">{result.savings_estimate}</p>
                  <p className="text-green-100 text-sm mt-1">by following this booking strategy</p>
                </div>
              )}

              {result.flight_strategy && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4"><Plane className="w-5 h-5 text-blue-600" /><h3 className="font-bold text-gray-900">Flight Strategy</h3></div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: "Book this far in advance", value: result.flight_strategy.ideal_booking_window },
                      { label: "Best days to buy", value: result.flight_strategy.best_days_to_book },
                      { label: "Cheapest days to fly", value: result.flight_strategy.best_days_to_fly },
                      { label: "Best time of day to search", value: result.flight_strategy.time_of_day_to_search },
                    ].map(s => (
                      <div key={s.label} className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs text-blue-500 mb-1">{s.label}</p>
                        <p className="font-semibold text-blue-900 text-sm">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  {result.flight_strategy.price_drop_triggers?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Price Drop Triggers</p>
                      <BulletList items={result.flight_strategy.price_drop_triggers} icon="📉" />
                    </div>
                  )}
                </div>
              )}

              {result.hotel_strategy && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4"><Hotel className="w-5 h-5 text-purple-600" /><h3 className="font-bold text-gray-900">Hotel Strategy</h3></div>
                  <div className="bg-purple-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-purple-500 mb-1">Ideal booking window</p>
                    <p className="font-semibold text-purple-900">{result.hotel_strategy.ideal_booking_window}</p>
                  </div>
                  {result.hotel_strategy.best_deal_tactics && <BulletList items={result.hotel_strategy.best_deal_tactics} />}
                  {result.hotel_strategy.cancellation_tip && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 inline mr-1" />{result.hotel_strategy.cancellation_tip}
                    </div>
                  )}
                </div>
              )}

              {result.deal_tools?.length > 0 && (
                <ResultCard title="🛠 Best Tools to Find Deals">
                  <div className="space-y-3">{result.deal_tools.map((t: any, i: number) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <p className="font-semibold text-gray-900 text-sm">{t.tool}</p>
                      <p className="text-xs text-gray-500 mb-1">{t.best_for}</p>
                      <p className="text-xs text-blue-600">💡 {t.pro_tip}</p>
                    </div>
                  ))}</div>
                </ResultCard>
              )}

              {result.red_flags?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-red-700 uppercase mb-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />Avoid These Mistakes</p>
                  <BulletList items={result.red_flags} icon="⚠" />
                </div>
              )}

              {result.insider_tips?.length > 0 && <ResultCard title="🎯 Insider Tips"><BulletList items={result.insider_tips} icon="✈" /></ResultCard>}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
