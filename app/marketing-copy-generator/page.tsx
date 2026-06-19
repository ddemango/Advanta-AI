"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Loader2 } from "lucide-react";
import ToolLayout, { CopyButton, ResultCard } from "@/components/tools/ToolLayout";

export default function MarketingCopyPage() {
  const [form, setForm] = useState({ product: "", audience: "", benefit: "", tone: "persuasive", format: "all" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/marketing-copy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate copy."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to generate copy. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Marketing Copy Generator" description="World-class copy for ads, emails, landing pages, and more." icon={<Building2 className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ k: "product", l: "Product / Service *", p: "e.g. AI-powered CRM software" }, { k: "audience", l: "Target Audience *", p: "e.g. B2B sales managers at mid-size companies" }, { k: "benefit", l: "Key Benefit / USP *", p: "e.g. Closes 40% more deals with less effort" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "tone", l: "Tone", opts: ["persuasive", "bold", "empathetic", "professional", "playful", "urgent"] },
                { k: "format", l: "Format", opts: ["all", "ads only", "email only", "landing page", "social media"] }
              ].map(({ k, l, opts }) => (
                <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <select value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                  </select></div>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.product || !form.audience} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Writing Copy...</> : "Generate Marketing Copy"}
            </button>
          </form>
        </div>

        <div>
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">Your copy will appear here</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">Headline</p>
                <p className="text-xl font-bold">{result.headline}</p>
                <p className="text-blue-100 mt-1">{result.subheadline}</p>
                <div className="mt-3 flex justify-end"><CopyButton text={`${result.headline}\n${result.subheadline}`} /></div>
              </div>
              <ResultCard title="Hero Copy">
                <p className="text-sm text-gray-700 leading-relaxed">{result.hero_copy}</p>
                <div className="mt-3 flex justify-end"><CopyButton text={result.hero_copy} /></div>
              </ResultCard>
              {result.ad_copies?.length > 0 && (
                <ResultCard title="Ad Copies">
                  <div className="space-y-3">
                    {result.ad_copies.map((ad: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-blue-600">{ad.platform}</span>
                          <CopyButton text={ad.copy} />
                        </div>
                        <p className="text-sm text-gray-700">{ad.copy}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              )}
              <div className="grid grid-cols-2 gap-4">
                <ResultCard title="Email Subject Lines">
                  <ul className="space-y-2">{result.email_subject_lines?.map((s: string, i: number) => <li key={i} className="text-sm text-gray-700 flex items-center gap-2"><span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>{s}</li>)}</ul>
                </ResultCard>
                <ResultCard title="CTAs">
                  <ul className="space-y-2">{result.cta_variations?.map((c: string, i: number) => <li key={i} className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium">{c}</li>)}</ul>
                </ResultCard>
              </div>
              {result.tagline && <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center"><p className="text-xs text-purple-500 font-semibold uppercase tracking-wide mb-1">Tagline</p><p className="text-lg font-bold text-purple-700">"{result.tagline}"</p></div>}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
