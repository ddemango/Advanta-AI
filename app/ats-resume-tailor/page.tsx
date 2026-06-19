"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import ToolLayout, { ScoreRing, TagList, CopyButton } from "@/components/tools/ToolLayout";

export default function ATSResumePage() {
  const [form, setForm] = useState({ resume: "", job_description: "", job_title: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/ats-resume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to optimize resume."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to optimize resume. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="ATS Resume Tailor" description="Optimize your resume for any job description. Beat the bots, get the interview." icon={<Target className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Job Title *</label>
              <input value={form.job_title} onChange={e => setForm(v => ({ ...v, job_title: e.target.value }))} placeholder="e.g. Senior Product Manager" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Paste Your Resume *</label>
              <textarea value={form.resume} onChange={e => setForm(v => ({ ...v, resume: e.target.value }))} placeholder="Paste your full resume text here..." rows={6} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Paste Job Description *</label>
              <textarea value={form.job_description} onChange={e => setForm(v => ({ ...v, job_description: e.target.value }))} placeholder="Paste the full job description here..." rows={6} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.resume || !form.job_description} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Optimizing Resume...</> : <><Target className="w-4 h-4" />Optimize for ATS</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center"><Target className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">ATS score, missing keywords, and optimized content will appear here</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-6">
                <ScoreRing score={result.ats_score || 0} label="ATS Score" />
                <div>
                  <p className="font-bold text-gray-900 text-lg">{result.ats_score >= 80 ? "🎉 Strong Match!" : result.ats_score >= 60 ? "⚠️ Needs Improvement" : "❌ Poor Match"}</p>
                  <p className="text-sm text-gray-500">{result.overall_feedback}</p>
                </div>
              </div>
              {result.missing_keywords?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-red-600 uppercase flex items-center gap-1 mb-3"><AlertTriangle className="w-3.5 h-3.5" />Missing Keywords (add these!)</p>
                  <TagList items={result.missing_keywords} color="red" />
                </div>
              )}
              {result.skills_to_add?.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-yellow-600 uppercase mb-3">Skills to Highlight</p>
                  <TagList items={result.skills_to_add} color="yellow" />
                </div>
              )}
              {result.optimized_summary && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Optimized Summary</p>
                    <CopyButton text={result.optimized_summary} />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.optimized_summary}</p>
                </div>
              )}
              {result.optimized_bullets?.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-green-600 uppercase mb-3 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Optimized Bullet Points</p>
                  <ul className="space-y-2">{result.optimized_bullets.map((b: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm text-green-800"><span className="text-green-500 flex-shrink-0">▸</span>{b}</li>)}</ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
