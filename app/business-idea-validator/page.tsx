"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Loader2, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import ToolLayout, { ScoreRing, BulletList } from "@/components/tools/ToolLayout";

export default function BusinessIdeaPage() {
  const [form, setForm] = useState({ idea: "", market: "", budget: "", skills: "", location: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/business-idea", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to validate idea."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to validate idea. Please try again."); }
    finally { setLoading(false); }
  };

  const score = result?.viability_score || 0;
  const scoreColor = score >= 70 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600";
  const scoreBg = score >= 70 ? "from-green-50 to-emerald-50 border-green-200" : score >= 50 ? "from-yellow-50 to-orange-50 border-yellow-200" : "from-red-50 to-pink-50 border-red-200";

  return (
    <ToolLayout title="Business Idea Validator" description="Get an honest AI assessment of your business idea with actionable next steps." icon={<Lightbulb className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Your Business Idea *</label>
              <textarea value={form.idea} onChange={e => setForm(v => ({ ...v, idea: e.target.value }))} placeholder="Describe your business idea in detail..." rows={3} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
            {[{ k: "market", l: "Target Market *", p: "e.g. Small business owners, Gen Z consumers" }, { k: "budget", l: "Starting Budget", p: "e.g. $5,000, bootstrapped" }, { k: "skills", l: "Your Skills / Background", p: "e.g. 5 years in marketing, technical background" }, { k: "location", l: "Location / Scope", p: "e.g. US-only, global, local city" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required={k === "market"} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            ))}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.idea || !form.market} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Validating Idea...</> : <><Lightbulb className="w-4 h-4" />Validate My Idea</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center">
              <Lightbulb className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">Your idea validation report will appear here</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className={`bg-gradient-to-br border rounded-2xl p-6 ${scoreBg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Viability Score</p>
                    <p className={`text-5xl font-black ${scoreColor}`}>{score}<span className="text-2xl">/100</span></p>
                    <p className="font-semibold text-gray-800 mt-2">{result.verdict}</p>
                  </div>
                  <ScoreRing score={score} label="Viability" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[{ l: "Market Size", v: result.market_size }, { l: "Competition", v: result.competition_level }, { l: "Time to Revenue", v: result.estimated_time_to_revenue }, { l: "Revenue Models", v: result.revenue_model?.[0] }].map((s, i) => (
                    <div key={i} className="bg-white/60 rounded-xl p-3"><p className="text-xs text-gray-500">{s.l}</p><p className="font-semibold text-gray-900 text-sm">{s.v}</p></div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-green-700 uppercase mb-3 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Advantages</p>
                  <BulletList items={result.key_advantages} icon="✓" />
                </div>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-red-700 uppercase mb-3 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />Risks</p>
                  <BulletList items={result.key_risks} icon="⚠" />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-xs font-semibold text-blue-700 uppercase mb-3 flex items-center gap-1"><ArrowRight className="w-3.5 h-3.5" />First Steps</p>
                <ol className="space-y-2">{result.first_steps?.map((s: string, i: number) => <li key={i} className="flex gap-2 text-sm text-blue-800"><span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>{s}</li>)}</ol>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
