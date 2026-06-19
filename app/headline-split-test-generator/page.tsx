"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Loader2, TrendingUp } from "lucide-react";
import ToolLayout, { CopyButton } from "@/components/tools/ToolLayout";

const psychColors: Record<string, string> = { curiosity: "bg-purple-50 border-purple-200", urgency: "bg-red-50 border-red-200", "social proof": "bg-green-50 border-green-200", benefit: "bg-blue-50 border-blue-200", pain: "bg-orange-50 border-orange-200", numbers: "bg-yellow-50 border-yellow-200" };

export default function HeadlineSplitPage() {
  const [form, setForm] = useState({ product: "", audience: "", goal: "conversions", current_headline: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/headline-split", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate headlines."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to generate headlines. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Headline Split-Test Generator" description="Generate 6 A/B test headline variations with predicted CTR and psychology analysis." icon={<Eye className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ k: "product", l: "Product / Page *", p: "e.g. SaaS landing page" }, { k: "audience", l: "Target Audience *", p: "e.g. Startup founders" }, { k: "current_headline", l: "Current Headline (optional)", p: "Paste your existing headline" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required={k !== "current_headline"} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            ))}
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Optimization Goal</label>
              <select value={form.goal} onChange={e => setForm(v => ({ ...v, goal: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white focus:ring-2 focus:ring-blue-500">
                {["conversions", "sign-ups", "clicks", "purchases", "leads"].map(g => <option key={g}>{g}</option>)}
              </select></div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.product} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating 6 Variants...</> : "Generate Headlines"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center min-h-64">
              <Eye className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">6 headline variants with psychology analysis will appear here</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {result.variants?.map((v: any, i: number) => {
                const colorKey = Object.keys(psychColors).find(k => v.type?.toLowerCase().includes(k)) || "benefit";
                return (
                  <div key={i} className={`border rounded-2xl p-4 ${psychColors[colorKey] || "bg-gray-50 border-gray-200"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-500">#{i + 1}</span>
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-600 bg-white/60 px-2 py-0.5 rounded-full">{v.type}</span>
                          <span className="text-xs text-green-600 font-semibold ml-auto">↑ {v.predicted_ctr} CTR</span>
                        </div>
                        <p className="font-bold text-gray-900 text-lg leading-tight">"{v.headline}"</p>
                        <p className="text-xs text-gray-500 mt-1">🎯 Best for: {v.best_for}</p>
                        <p className="text-xs text-gray-600 mt-1">🧠 {v.psychology}</p>
                      </div>
                      <CopyButton text={v.headline} />
                    </div>
                  </div>
                );
              })}
              {result.winner_prediction && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div><p className="text-xs font-semibold text-green-600 uppercase">Predicted Winner</p><p className="text-sm text-green-700">{result.winner_prediction}</p></div>
                </div>
              )}
              {result.testing_advice && <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700"><strong>Testing Advice:</strong> {result.testing_advice}</div>}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
