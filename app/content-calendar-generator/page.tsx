"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2 } from "lucide-react";
import ToolLayout, { CopyButton } from "@/components/tools/ToolLayout";

export default function ContentCalendarPage() {
  const [form, setForm] = useState({ brand: "", industry: "", platforms: "Instagram, LinkedIn", frequency: "3x per week", goals: "brand awareness", audience: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeWeek, setActiveWeek] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/content-calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate calendar."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to generate calendar. Please try again."); }
    finally { setLoading(false); }
  };

  const platformColors: Record<string, string> = { Instagram: "bg-pink-100 text-pink-700", LinkedIn: "bg-blue-100 text-blue-700", Twitter: "bg-sky-100 text-sky-700", TikTok: "bg-gray-900 text-white", YouTube: "bg-red-100 text-red-700", Facebook: "bg-indigo-100 text-indigo-700" };

  return (
    <ToolLayout title="Content Calendar Generator" description="Generate a full 4-week content calendar with captions, hashtags, and strategy." icon={<Calendar className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ k: "brand", l: "Brand Name *", p: "e.g. GrowthLabs" }, { k: "industry", l: "Industry *", p: "e.g. SaaS, E-commerce" }, { k: "platforms", l: "Platforms", p: "e.g. Instagram, LinkedIn, TikTok" }, { k: "frequency", l: "Posting Frequency", p: "e.g. 5x per week" }, { k: "goals", l: "Content Goals", p: "e.g. lead gen, engagement" }, { k: "audience", l: "Target Audience *", p: "e.g. startup founders" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required={["brand", "industry", "audience"].includes(k)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            ))}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.brand} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Building Calendar...</> : <><Calendar className="w-4 h-4" />Generate Calendar</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center min-h-64">
              <Calendar className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">Your 4-week content calendar will appear here</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {result.strategy && <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700"><strong>📋 Strategy: </strong>{result.strategy}</div>}
              <div className="flex gap-2">{result.weeks?.map((_: any, i: number) => <button key={i} onClick={() => setActiveWeek(i)} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${activeWeek === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Week {i + 1}</button>)}</div>
              {result.weeks?.[activeWeek] && (
                <div className="space-y-3">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 text-sm font-semibold text-purple-700">🎯 Theme: {result.weeks[activeWeek].theme}</div>
                  {result.weeks[activeWeek].posts?.map((post: any, i: number) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-gray-500">{post.day}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${platformColors[post.platform] || "bg-gray-100 text-gray-600"}`}>{post.platform}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.type}</span>
                        <div className="ml-auto"><CopyButton text={`${post.caption}\n\n${post.hashtags?.join(" ")}`} label="Copy Post" /></div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{post.caption}</p>
                      <div className="flex flex-wrap gap-1 mt-2">{post.hashtags?.map((h: string, j: number) => <span key={j} className="text-xs text-purple-600">#{h.replace("#", "")}</span>)}</div>
                    </div>
                  ))}
                </div>
              )}
              {result.tips?.length > 0 && <div className="bg-green-50 border border-green-200 rounded-xl p-4"><p className="text-xs font-semibold text-green-700 uppercase mb-2">💡 Pro Tips</p><ul className="space-y-1">{result.tips.map((t: string, i: number) => <li key={i} className="text-sm text-green-700">• {t}</li>)}</ul></div>}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
