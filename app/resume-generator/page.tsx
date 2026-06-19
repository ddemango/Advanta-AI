"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Download } from "lucide-react";
import ToolLayout, { ScoreRing, TagList, CopyButton } from "@/components/tools/ToolLayout";

export default function ResumeGeneratorPage() {
  const [form, setForm] = useState({ name: "", role: "", experience: "", skills: "", education: "", achievements: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/resume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate resume."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to generate resume. Please try again."); }
    finally { setLoading(false); }
  };

  const download = () => {
    if (!result) return;
    const txt = [form.name, form.role, "", "PROFESSIONAL SUMMARY", result.summary, "", "EXPERIENCE", ...result.experience?.map((e: any) => `\n${e.title} at ${e.company}\n${e.bullets?.map((b: string) => `• ${b}`).join("\n")}`) || [], "", "SKILLS", "Technical: " + result.skills?.technical?.join(", "), "Soft: " + result.skills?.soft?.join(", "), "", "EDUCATION", result.education].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" })); a.download = `resume-${form.name.replace(/\s+/g, "-")}.txt`; a.click();
  };

  return (
    <ToolLayout title="Resume Generator" description="Build an ATS-optimized professional resume with AI-crafted bullet points." icon={<FileText className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ k: "name", l: "Full Name *", p: "e.g. Jane Smith" }, { k: "role", l: "Target Job Title *", p: "e.g. Senior Marketing Manager" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            ))}
            {[{ k: "experience", l: "Work Experience *", p: "List your roles, companies, and responsibilities" }, { k: "skills", l: "Skills *", p: "e.g. SEO, Google Ads, HubSpot, Python, leadership" }, { k: "achievements", l: "Key Achievements *", p: "e.g. Grew organic traffic 200%, managed $1M budget" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <textarea value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
            ))}
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Education</label>
              <input value={form.education} onChange={e => setForm(v => ({ ...v, education: e.target.value }))} placeholder="e.g. B.S. Marketing, NYU 2018" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.name || !form.role} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Building Resume...</> : <><FileText className="w-4 h-4" />Generate Resume</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center"><FileText className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">Your optimized resume will appear here</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div><h2 className="text-xl font-black text-gray-900">{form.name}</h2><p className="text-blue-600 font-semibold">{form.role}</p></div>
                  <div className="flex gap-2">
                    <CopyButton text={result.summary} label="Copy" />
                    <button onClick={download} className="inline-flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg"><Download className="w-3.5 h-3.5" />Download</button>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 mb-4"><p className="text-xs font-semibold text-blue-600 uppercase mb-2">Professional Summary</p><p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p></div>
                {result.experience?.map((exp: any, i: number) => (
                  <div key={i} className="mb-4"><p className="font-semibold text-gray-900 text-sm">{exp.title}</p><p className="text-xs text-blue-600 mb-2">{exp.company}</p><ul className="space-y-1">{exp.bullets?.map((b: string, j: number) => <li key={j} className="text-xs text-gray-600 flex gap-2"><span className="text-blue-400 flex-shrink-0">▸</span>{b}</li>)}</ul></div>
                ))}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><p className="text-xs font-semibold text-gray-500 uppercase mb-2">Technical</p><TagList items={result.skills?.technical || []} /></div>
                  <div><p className="text-xs font-semibold text-gray-500 uppercase mb-2">Soft Skills</p><TagList items={result.skills?.soft || []} color="green" /></div>
                </div>
              </div>
              {result.ats_keywords?.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-yellow-700 uppercase mb-2">🎯 ATS Keywords to Include</p>
                  <TagList items={result.ats_keywords} color="yellow" />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
