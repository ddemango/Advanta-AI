"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Loader2, Hash } from "lucide-react";
import ToolLayout, { CopyButton, TagList } from "@/components/tools/ToolLayout";

export default function TrendingContentPage() {
  const [form, setForm] = useState({ niche: "", platform: "Instagram", content_type: "mixed", audience: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/trending-content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch { setError("Failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Trending Content Generator" description="AI-powered viral content ideas with hooks, outlines, and hashtags." icon={<TrendingUp className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ k: "niche", l: "Your Niche *", p: "e.g. Personal finance, fitness, SaaS" }, { k: "audience", l: "Target Audience *", p: "e.g. Millennials building wealth" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Platform</label>
                <select value={form.platform} onChange={e => setForm(v => ({ ...v, platform: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white focus:ring-2 focus:ring-blue-500">
                  {["Instagram", "TikTok", "LinkedIn", "YouTube", "Twitter/X", "All Platforms"].map(p => <option key={p}>{p}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Content Type</label>
                <select value={form.content_type} onChange={e => setForm(v => ({ ...v, content_type: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white focus:ring-2 focus:ring-blue-500">
                  {["mixed", "video", "carousel", "text post", "reel/short"].map(t => <option key={t}>{t}</option>)}
                </select></div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.niche} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Finding Trends...</> : <><TrendingUp className="w-4 h-4" />Generate Content Ideas</>}
            </button>
          </form>
          {result?.trending_hooks && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">🔥 Trending Hooks</p>
              <div className="space-y-2">{result.trending_hooks.map((h: string, i: number) => <div key={i} className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 text-xs text-orange-700 font-medium">"{h}"</div>)}</div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center min-h-64">
              <TrendingUp className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">5 viral content ideas will appear here</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {result.content_ideas?.map((idea: any, i: number) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase">{idea.format}</span>
                      <h3 className="font-bold text-gray-900 mt-0.5">{idea.title}</h3>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">{idea.viral_factor}</span>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 mb-3">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Hook:</p>
                    <p className="text-sm text-blue-800 italic">"{idea.hook}"</p>
                    <div className="mt-2 flex justify-end"><CopyButton text={idea.hook} label="Copy Hook" /></div>
                  </div>
                  {idea.outline?.length > 0 && <div className="mb-3"><p className="text-xs font-semibold text-gray-500 mb-2">Content Outline:</p><ol className="space-y-1">{idea.outline.map((o: string, j: number) => <li key={j} className="flex gap-2 text-xs text-gray-600"><span className="font-bold text-gray-400">{j+1}.</span>{o}</li>)}</ol></div>}
                  <div className="flex flex-wrap gap-1.5">{idea.hashtags?.map((h: string, j: number) => <span key={j} className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-medium">{h.startsWith("#") ? h : `#${h}`}</span>)}</div>
                </div>
              ))}
              {result.posting_strategy && <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700"><strong>📅 Strategy:</strong> {result.posting_strategy}</div>}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
