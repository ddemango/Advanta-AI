"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Loader2 } from "lucide-react";
import ToolLayout, { CopyButton, ResultCard } from "@/components/tools/ToolLayout";

export default function BrandKitPage() {
  const [form, setForm] = useState({ brand_name: "", industry: "", values: "", audience: "", style: "modern and professional" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/brand-kit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate brand kit."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to generate brand kit. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Brand Kit Generator" description="Generate a complete brand identity: colors, typography, voice, tagline and more." icon={<Target className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ k: "brand_name", l: "Brand Name *", p: "e.g. NovaTech" }, { k: "industry", l: "Industry *", p: "e.g. FinTech, Health & Wellness" }, { k: "values", l: "Core Values *", p: "e.g. Innovation, trust, simplicity" }, { k: "audience", l: "Target Audience *", p: "e.g. Professionals aged 25-45" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            ))}
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Style Preference</label>
              <select value={form.style} onChange={e => setForm(v => ({ ...v, style: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {["modern and professional", "bold and energetic", "minimal and clean", "friendly and playful", "luxury and premium", "earthy and organic"].map(s => <option key={s}>{s}</option>)}
              </select></div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.brand_name} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Building Brand Kit...</> : "Generate Brand Kit"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center"><Target className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">Your complete brand kit will appear here</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-gray-900 rounded-2xl p-6 text-white">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Brand Identity</p>
                <h2 className="text-2xl font-black">{result.brand_name}</h2>
                <p className="text-blue-400 font-medium mt-1 italic">"{result.tagline}"</p>
                <p className="text-gray-300 text-sm mt-3 leading-relaxed">{result.brand_story}</p>
                <CopyButton text={`${result.brand_name}\n"${result.tagline}"\n\n${result.brand_story}`} />
              </div>

              {result.colors?.length > 0 && (
                <ResultCard title="Color Palette">
                  <div className="flex gap-3 flex-wrap">
                    {result.colors.map((c: any, i: number) => (
                      <div key={i} className="text-center">
                        <div className="w-14 h-14 rounded-xl border border-gray-200 shadow-sm mb-1" style={{ backgroundColor: c.hex }} />
                        <p className="text-xs font-bold text-gray-800">{c.hex}</p>
                        <p className="text-xs text-gray-500">{c.name}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              )}

              <ResultCard title="Typography">
                <div className="space-y-2 text-sm">
                  <div><span className="font-semibold text-gray-700">Primary: </span><span className="text-gray-600">{result.typography?.primary}</span></div>
                  <div><span className="font-semibold text-gray-700">Secondary: </span><span className="text-gray-600">{result.typography?.secondary}</span></div>
                  <div><span className="font-semibold text-gray-700">Usage: </span><span className="text-gray-600">{result.typography?.usage}</span></div>
                </div>
              </ResultCard>

              <ResultCard title="Brand Voice">
                <p className="text-sm text-gray-700 mb-3"><strong>Tone:</strong> {result.voice?.tone}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs font-semibold text-green-600 mb-2">✓ Words to Use</p><div className="flex flex-wrap gap-1">{result.voice?.words_to_use?.map((w: string, i: number) => <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{w}</span>)}</div></div>
                  <div><p className="text-xs font-semibold text-red-500 mb-2">✗ Words to Avoid</p><div className="flex flex-wrap gap-1">{result.voice?.words_to_avoid?.map((w: string, i: number) => <span key={i} className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">{w}</span>)}</div></div>
                </div>
              </ResultCard>
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
