"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import ToolLayout, { CopyButton } from "@/components/tools/ToolLayout";

export default function FAQGeneratorPage() {
  const [form, setForm] = useState({ topic: "", product_service: "", audience: "", num_faqs: "10", tone: "professional and helpful" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/faq-generator", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate FAQs."); }
      setResult(await res.json()); setOpenIdx(0);
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  const allText = result?.faqs?.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  return (
    <ToolLayout title="FAQ Generator" description="Generate SEO-optimized FAQ sections with schema markup ready to paste." icon={<HelpCircle className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Topic / Page *</label>
              <input value={form.topic} onChange={e => setForm(v => ({ ...v, topic: e.target.value }))} placeholder="e.g. Email marketing software" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Product / Service Name</label>
              <input value={form.product_service} onChange={e => setForm(v => ({ ...v, product_service: e.target.value }))} placeholder="e.g. Mailchimp, our SaaS app" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Target Audience</label>
              <input value={form.audience} onChange={e => setForm(v => ({ ...v, audience: e.target.value }))} placeholder="e.g. Small business owners" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Number of FAQs</label>
                <select value={form.num_faqs} onChange={e => setForm(v => ({ ...v, num_faqs: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["5", "8", "10", "15"].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tone</label>
                <select value={form.tone} onChange={e => setForm(v => ({ ...v, tone: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["professional and helpful", "friendly and casual", "technical and precise", "empathetic and supportive"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.topic} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating FAQs...</> : <><HelpCircle className="w-4 h-4" />Generate FAQs</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center min-h-64">
              <HelpCircle className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400">Your FAQ section will appear here</p>
              <p className="text-gray-300 text-sm mt-1">Includes schema markup for Google rich results</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">{result.faqs?.length} FAQs generated</p>
                <CopyButton text={allText} label="Copy All FAQs" />
              </div>
              {result.faqs?.map((faq: any, i: number) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">{faq.category}</span>
                      <p className="font-medium text-gray-900 text-sm">{faq.question}</p>
                    </div>
                    {openIdx === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openIdx === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                          <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                          <div className="mt-2 flex justify-end"><CopyButton text={`Q: ${faq.question}\nA: ${faq.answer}`} /></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              {result.schema_markup && (
                <div className="bg-gray-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase">Schema Markup (paste in &lt;head&gt;)</p>
                    <CopyButton text={result.schema_markup} label="Copy Schema" />
                  </div>
                  <p className="text-xs text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">{result.schema_markup}</p>
                </div>
              )}
              {result.seo_tips?.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-700 uppercase mb-2">💡 SEO Tips</p>
                  <ul className="space-y-1">{result.seo_tips.map((t: string, i: number) => <li key={i} className="text-sm text-blue-700">• {t}</li>)}</ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
