"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Youtube, Loader2 } from "lucide-react";
import ToolLayout, { CopyButton, TagList, ResultCard } from "@/components/tools/ToolLayout";

export default function YouTubeDescriptionPage() {
  const [form, setForm] = useState({ title: "", topic: "", channel_niche: "", keywords: "", timestamps: "", cta_link: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/youtube-description", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate description."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="YouTube Description Generator" description="SEO-optimized YouTube descriptions, tags, chapters, and thumbnail ideas." icon={<Youtube className="w-6 h-6 text-red-500" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { k: "title", l: "Video Title *", p: "e.g. How I Made $10K With Dropshipping in 30 Days" },
              { k: "topic", l: "Video Summary *", p: "What is this video about? Key points covered..." },
              { k: "channel_niche", l: "Channel Niche", p: "e.g. Personal Finance, Fitness, Tech Reviews" },
              { k: "keywords", l: "Target Keywords", p: "e.g. dropshipping 2025, make money online" },
              { k: "timestamps", l: "Timestamps (optional)", p: "e.g. 0:00 Intro, 2:30 My Strategy, 5:00 Results" },
              { k: "cta_link", l: "CTA Link (optional)", p: "e.g. https://yoursite.com/freebie" },
            ].map(({ k, l, p }) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                {k === "topic" || k === "timestamps" ? (
                  <textarea value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} rows={3} required={k === "topic"} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                ) : (
                  <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required={["title", "topic"].includes(k)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                )}
              </div>
            ))}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.title || !form.topic} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Youtube className="w-4 h-4" />Generate YouTube Package</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center">
              <Youtube className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400">Description, tags, chapters & thumbnail ideas will appear here</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <ResultCard title="Full Description">
                <div className="flex justify-end mb-2"><CopyButton text={result.description} label="Copy Description" /></div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.description}</p>
              </ResultCard>
              {result.tags?.length > 0 && (
                <ResultCard title="Tags">
                  <TagList items={result.tags} color="red" />
                </ResultCard>
              )}
              {result.chapters?.length > 0 && (
                <ResultCard title="Chapter Markers">
                  <ul className="space-y-1">{result.chapters.map((c: string, i: number) => <li key={i} className="text-sm text-gray-700 font-mono">{c}</li>)}</ul>
                  <div className="mt-3"><CopyButton text={result.chapters.join("\n")} label="Copy Chapters" /></div>
                </ResultCard>
              )}
              {result.seo_title_variations?.length > 0 && (
                <ResultCard title="Alternative Title Ideas">
                  <ul className="space-y-2">{result.seo_title_variations.map((t: string, i: number) => (
                    <li key={i} className="flex items-center justify-between gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                      <span>{t}</span>
                      <CopyButton text={t} />
                    </li>
                  ))}</ul>
                </ResultCard>
              )}
              {result.thumbnail_text_ideas?.length > 0 && (
                <ResultCard title="Thumbnail Text Ideas">
                  <div className="flex flex-wrap gap-2">{result.thumbnail_text_ideas.map((t: string, i: number) => (
                    <span key={i} className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1.5 rounded-full font-bold">{t}</span>
                  ))}</div>
                </ResultCard>
              )}
              {result.pinned_comment && (
                <ResultCard title="Pinned Comment Template">
                  <p className="text-sm text-gray-700">{result.pinned_comment}</p>
                  <div className="mt-2"><CopyButton text={result.pinned_comment} /></div>
                </ResultCard>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
