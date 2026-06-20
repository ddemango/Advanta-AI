"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Download } from "lucide-react";
import ToolLayout, { CopyButton, TagList } from "@/components/tools/ToolLayout";

export default function CoverLetterPage() {
  const [form, setForm] = useState({ name: "", role: "", company: "", experience: "", skills: "", reason: "", job_description: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/cover-letter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate cover letter."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  const download = () => {
    if (!result) return;
    const txt = `Subject: ${result.subject_line}\n\n${result.cover_letter}`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
    a.download = `cover-letter-${form.company.replace(/\s+/g, "-")}.txt`;
    a.click();
  };

  return (
    <ToolLayout title="Cover Letter Generator" description="AI-crafted cover letters tailored to the job, company, and your experience." icon={<FileText className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { k: "name", l: "Your Full Name *", p: "e.g. Jane Smith" },
              { k: "role", l: "Job Title You're Applying For *", p: "e.g. Senior Product Manager" },
              { k: "company", l: "Company Name *", p: "e.g. Stripe" },
              { k: "skills", l: "Your Top Skills", p: "e.g. Product strategy, user research, cross-functional leadership" },
            ].map(({ k, l, p }) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required={["name", "role", "company"].includes(k)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Relevant Experience *</label>
              <textarea value={form.experience} onChange={e => setForm(v => ({ ...v, experience: e.target.value }))} placeholder="Briefly describe your most relevant experience for this role..." rows={3} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Why This Company?</label>
              <input value={form.reason} onChange={e => setForm(v => ({ ...v, reason: e.target.value }))} placeholder="e.g. I admire how Stripe is reshaping global payments" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Job Description (paste or summarize)</label>
              <textarea value={form.job_description} onChange={e => setForm(v => ({ ...v, job_description: e.target.value }))} placeholder="Paste the job description for a more tailored letter..." rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.name || !form.role || !form.company} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Writing Cover Letter...</> : <><FileText className="w-4 h-4" />Generate Cover Letter</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center">
              <FileText className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400">Your tailored cover letter will appear here</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <span className="text-xs font-semibold text-blue-600 uppercase">Suggested Subject Line</span>
                <p className="text-sm font-medium text-blue-900 mt-1">{result.subject_line}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Cover Letter</p>
                  <div className="flex gap-2">
                    <CopyButton text={result.cover_letter} label="Copy" />
                    <button onClick={download} className="inline-flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Download className="w-3.5 h-3.5" />Download
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.cover_letter}</p>
              </div>
              {result.key_selling_points?.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-700 uppercase mb-3">✅ Key Selling Points Used</p>
                  <ul className="space-y-1">{result.key_selling_points.map((p: string, i: number) => <li key={i} className="text-sm text-green-800 flex gap-2"><span className="text-green-500">▸</span>{p}</li>)}</ul>
                </div>
              )}
              {result.customization_tips?.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-yellow-700 uppercase mb-3">💡 Customization Tips</p>
                  <ul className="space-y-1">{result.customization_tips.map((t: string, i: number) => <li key={i} className="text-sm text-yellow-800 flex gap-2"><span className="text-yellow-500">▸</span>{t}</li>)}</ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
