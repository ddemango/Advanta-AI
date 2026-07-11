"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import ToolLayout, { CopyButton, TagList } from "@/components/tools/ToolLayout";

export default function LinkedInPostPage() {
  const [form, setForm] = useState({ topic: "", angle: "thought leadership", audience: "", tone: "professional but conversational", include_cta: "yes" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/linkedin-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate posts."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="LinkedIn Post Generator" description="AI-crafted LinkedIn posts that drive engagement, followers, and leads." icon={<Share2 className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Topic / Idea *</label>
              <textarea value={form.topic} onChange={e => setForm(v => ({ ...v, topic: e.target.value }))} placeholder="e.g. How I grew my SaaS to $10k MRR without paid ads" rows={3} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Audience</label>
              <input value={form.audience} onChange={e => setForm(v => ({ ...v, audience: e.target.value }))} placeholder="e.g. SaaS founders, marketing managers" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "angle", l: "Post Angle", opts: ["thought leadership", "personal story", "tips & tactics", "controversial take", "data & stats", "behind the scenes"] },
                { k: "tone", l: "Tone", opts: ["professional but conversational", "bold and direct", "inspirational", "educational", "storytelling", "humorous"] },
              ].map(({ k, l, opts }) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <select value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.topic} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Writing 3 Posts...</> : <><Share2 className="w-4 h-4" />Generate LinkedIn Posts</>}
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center">
              <Share2 className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400">3 LinkedIn post variations will appear here</p>
              <p className="text-gray-300 text-sm mt-1">Each with hook, body, hashtags, and why it works</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {result.posts?.map((post: any, i: number) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <button onClick={() => setExpanded(expanded === i ? -1 : i)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Version {i + 1} · {post.estimated_reach}</span>
                      <p className="font-semibold text-gray-900 text-sm mt-0.5 line-clamp-2">🪝 {post.hook}</p>
                    </div>
                    {expanded === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />}
                  </button>
                  {expanded === i && (
                    <div className="px-5 pb-5 border-t border-gray-100 space-y-4 pt-4">
                      <div className="bg-[#f3f2ef] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-gray-500">Full Post</span>
                          <CopyButton text={`${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags?.join(" ")}`} label="Copy Post" />
                        </div>
                        <p className="text-sm text-gray-800 font-semibold mb-2">{post.hook}</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{post.body}</p>
                        <p className="text-sm text-blue-700 font-medium mt-3">{post.cta}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.hashtags?.map((h: string, j: number) => <span key={j} className="text-xs text-blue-600">#{h.replace("#", "")}</span>)}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3">
                        <span className="text-xs font-semibold text-green-700">💡 Why it works: </span>
                        <span className="text-sm text-green-700">{post.why_it_works}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
