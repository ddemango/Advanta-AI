"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Loader2 } from "lucide-react";
import ToolLayout, { CopyButton, ResultCard, BulletList } from "@/components/tools/ToolLayout";

export default function VoiceoverPage() {
  const [form, setForm] = useState({ topic: "", duration: "60 seconds", style: "conversational", audience: "", platform: "YouTube" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/voiceover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate script."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to generate script. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="AI Voiceover Script Generator" description="Generate professional voiceover scripts for videos, podcasts, ads, and presentations." icon={<Mic className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Topic / Message *</label>
              <textarea value={form.topic} onChange={e => setForm(v => ({ ...v, topic: e.target.value }))} placeholder="What is this voiceover about? e.g. Product demo for a new AI tool that saves 10 hours a week" rows={3} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
            <div className="grid grid-cols-2 gap-3">
              {[{ k: "duration", l: "Duration", opts: ["15 seconds", "30 seconds", "60 seconds", "2 minutes", "5 minutes"] }, { k: "platform", l: "Platform", opts: ["YouTube", "TikTok/Reels", "Podcast", "Ad/Commercial", "Presentation", "Explainer Video"] }, { k: "style", l: "Style", opts: ["conversational", "professional", "energetic", "calm and soothing", "storytelling", "urgent"] }].map(({ k, l, opts }) => (
                <div key={k} className={k === "style" ? "col-span-2" : ""}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <select value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select></div>
              ))}
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Target Audience</label>
              <input value={form.audience} onChange={e => setForm(v => ({ ...v, audience: e.target.value }))} placeholder="e.g. Small business owners, Gen Z" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.topic} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Writing Script...</> : <><Mic className="w-4 h-4" />Generate Script</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center"><Mic className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">Your voiceover script will appear here</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3 text-center"><p className="text-xs text-blue-500">Word Count</p><p className="font-black text-blue-700 text-lg">{result.word_count}</p></div>
                <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-3 text-center"><p className="text-xs text-green-500">Duration</p><p className="font-black text-green-700 text-lg">{result.estimated_duration}</p></div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-orange-600 uppercase mb-1">🎣 Hook</p>
                <p className="text-sm text-orange-800 font-medium italic">"{result.hook}"</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Full Script</p>
                  <CopyButton text={result.script} label="Copy Script" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result.script}</p>
              </div>
              {result.cta && <div className="bg-blue-600 rounded-xl p-4 text-center"><p className="text-xs text-blue-200 font-semibold mb-1">Call to Action</p><p className="text-white font-bold">"{result.cta}"</p></div>}
              {result.delivery_notes?.length > 0 && <ResultCard title="Delivery Notes"><BulletList items={result.delivery_notes} icon="🎙" /></ResultCard>}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
