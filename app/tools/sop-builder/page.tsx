"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileText, ArrowLeft, Loader2, Download } from "lucide-react";

interface SopData {
  title: string;
  owner: string;
  frequency: string;
  purpose: string;
  steps: { name: string; detail: string }[];
  tools: string[];
}

export default function SopBuilderPage() {
  const [form, setForm] = useState({ title: "", process: "", department: "", frequency: "", tools: "", requirements: "" });
  const [result, setResult] = useState<SopData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/sop", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch { setError("Failed to generate SOP. Please try again."); }
    finally { setLoading(false); }
  };

  const download = () => {
    if (!result) return;
    const txt = [`SOP: ${result.title}`, `Owner: ${result.owner}`, `Frequency: ${result.frequency}`, `Purpose: ${result.purpose}`, "", "STEPS:", ...result.steps.map((s, i) => `${i + 1}. ${s.name}\n   ${s.detail}`), "", "TOOLS REQUIRED:", ...result.tools.map(t => `• ${t}`)].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" })); a.download = `sop-${result.title.toLowerCase().replace(/\s+/g, "-")}.txt`; a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/free-tools" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-8"><ArrowLeft className="w-4 h-4" /> Back to Free Tools</Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-blue-600" /></div>
            <h1 className="text-3xl font-bold text-gray-900">SOP Builder</h1>
          </div>
          <p className="text-gray-600 mb-8">Generate professional Standard Operating Procedures with AI-powered step-by-step instructions.</p>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "title", label: "SOP Title *", placeholder: "e.g. Customer Onboarding Process" },
                  { key: "process", label: "Process Description", placeholder: "Describe the process in detail" },
                  { key: "department", label: "Department / Team", placeholder: "e.g. Sales, Customer Success" },
                  { key: "frequency", label: "Frequency", placeholder: "e.g. Daily, Weekly, Per request" },
                  { key: "tools", label: "Tools & Systems Used", placeholder: "e.g. Salesforce, Slack, Jira" },
                  { key: "requirements", label: "Prerequisites / Requirements", placeholder: "What's needed before starting?" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type="text" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} required={key === "title"} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={loading || !form.title} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Building SOP...</> : "Build SOP"}
                </button>
              </form>
            </div>

            <div>
              {!result ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full flex flex-col items-center justify-center text-center">
                  <FileText className="w-12 h-12 text-gray-200 mb-4" />
                  <p className="text-gray-400">Your SOP will appear here</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{result.title}</h3>
                      <p className="text-sm text-gray-500">Owner: {result.owner} · {result.frequency}</p>
                    </div>
                    <button onClick={download} className="flex items-center gap-1 text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50">
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>
                  {result.purpose && <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 mb-4">{result.purpose}</p>}
                  <ol className="space-y-3 mb-4">
                    {result.steps?.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{s.name}</div>
                          <div className="text-gray-600 text-xs mt-0.5">{s.detail}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                  {result.tools?.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Tools Required</div>
                      <div className="flex flex-wrap gap-1.5">{result.tools.map((t, i) => <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{t}</span>)}</div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
