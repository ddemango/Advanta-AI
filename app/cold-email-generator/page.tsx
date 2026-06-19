"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import ToolLayout, { CopyButton, ResultCard } from "@/components/tools/ToolLayout";

export default function ColdEmailPage() {
  const [form, setForm] = useState({ prospect: "", company: "", role: "", pain_point: "", your_offer: "", tone: "professional", sender_name: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/cold-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate emails."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to generate emails. Please try again."); }
    finally { setLoading(false); }
  };

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <ToolLayout title="Cold Email Generator" description="AI-crafted personalized cold emails that actually get replies." icon={<Mail className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Prospect Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[{ k: "prospect", l: "Prospect Name *", p: "e.g. John Smith" }, { k: "sender_name", l: "Your Name", p: "e.g. Sarah Jones" }].map(({ k, l, p }) => (
                <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <input value={(form as any)[k]} onChange={e => f(k, e.target.value)} placeholder={p} required={k === "prospect"} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              ))}
            </div>
            {[{ k: "company", l: "Their Company *", p: "e.g. Acme Corp" }, { k: "role", l: "Their Role *", p: "e.g. VP of Marketing" }, { k: "pain_point", l: "Their Pain Point *", p: "e.g. Struggling with low email open rates" }, { k: "your_offer", l: "Your Offer / Solution *", p: "e.g. AI-powered email tool that increases opens by 40%" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => f(k, e.target.value)} placeholder={p} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            ))}
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Email Tone</label>
              <select value={form.tone} onChange={e => f("tone", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {["professional", "casual", "bold", "empathetic", "direct"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select></div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.prospect || !form.company} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating 3 Emails...</> : <><Mail className="w-4 h-4" />Generate Cold Emails</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center h-full flex flex-col items-center justify-center">
              <Mail className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">3 personalized email variations will appear here</p>
              <p className="text-gray-300 text-sm mt-1">Each with subject line, body, and why it works</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {result.emails?.map((email: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <button onClick={() => setExpanded(expanded === i ? -1 : i)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                    <div className="text-left">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Version {i + 1}</span>
                      <p className="font-semibold text-gray-900 text-sm mt-0.5">📧 {email.subject}</p>
                    </div>
                    {expanded === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {expanded === i && (
                    <div className="px-5 pb-5 border-t border-gray-100 space-y-4">
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500 uppercase">Email Body</span>
                          <CopyButton text={`Subject: ${email.subject}\n\n${email.body}\n\n${email.cta}`} label="Copy Email" />
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{email.body}</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3">
                        <span className="text-xs font-semibold text-blue-700">CTA: </span>
                        <span className="text-sm text-blue-700">{email.cta}</span>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3">
                        <span className="text-xs font-semibold text-green-700">💡 Why it works: </span>
                        <span className="text-sm text-green-700">{email.why_it_works}</span>
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
