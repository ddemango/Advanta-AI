"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle, ArrowLeft, Loader2, Download } from "lucide-react";

interface RfpData {
  project: string;
  summary: string;
  requirements: string[];
  timeline: string[];
  assumptions: string[];
  risks: string[];
}

export default function RfpPage() {
  const [form, setForm] = useState({ project: "", description: "", requirements: "", timeline: "", budget: "", constraints: "" });
  const [result, setResult] = useState<RfpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/rfp-response", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate RFP response."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to generate RFP response. Please try again."); }
    finally { setLoading(false); }
  };

  const download = () => {
    if (!result) return;
    const txt = [`RFP RESPONSE: ${result.project}`, "", "EXECUTIVE SUMMARY:", result.summary, "", "REQUIREMENTS UNDERSTANDING:", ...result.requirements.map(r => `• ${r}`), "", "PROPOSED TIMELINE:", ...result.timeline.map(t => `• ${t}`), "", "ASSUMPTIONS:", ...result.assumptions.map(a => `• ${a}`), "", "RISKS & MITIGATIONS:", ...result.risks.map(r => `• ${r}`)].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" })); a.download = `rfp-${result.project.toLowerCase().replace(/\s+/g, "-")}.txt`; a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/free-tools" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-8"><ArrowLeft className="w-4 h-4" /> Back to Free Tools</Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><CheckCircle className="w-5 h-5 text-blue-600" /></div>
            <h1 className="text-3xl font-bold text-gray-900">RFP Response Builder</h1>
          </div>
          <p className="text-gray-600 mb-8">Generate professional RFP responses with AI-structured outlines, timelines, and risk assessments.</p>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "project", label: "Project Name *", placeholder: "e.g. CRM Implementation" },
                  { key: "description", label: "Project Description", placeholder: "Describe the project scope" },
                  { key: "requirements", label: "Key Requirements", placeholder: "List the main requirements" },
                  { key: "timeline", label: "Expected Timeline", placeholder: "e.g. 6 months, Q1 2025" },
                  { key: "budget", label: "Budget Range", placeholder: "e.g. $50,000 - $100,000" },
                  { key: "constraints", label: "Constraints", placeholder: "e.g. Must integrate with Salesforce" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type="text" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} required={key === "project"} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={loading || !form.project} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : "Generate RFP Response"}
                </button>
              </form>
            </div>

            <div>
              {!result ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full flex flex-col items-center justify-center text-center">
                  <CheckCircle className="w-12 h-12 text-gray-200 mb-4" />
                  <p className="text-gray-400">Your RFP response will appear here</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">{result.project}</h3>
                    <button onClick={download} className="flex items-center gap-1 text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50"><Download className="w-4 h-4" /> Export</button>
                  </div>
                  {[
                    { title: "Executive Summary", items: [result.summary], isList: false },
                    { title: "Requirements Understanding", items: result.requirements, isList: true },
                    { title: "Proposed Timeline", items: result.timeline, isList: true },
                    { title: "Assumptions", items: result.assumptions, isList: true },
                    { title: "Risks & Mitigations", items: result.risks, isList: true },
                  ].map(({ title, items, isList }) => (
                    <div key={title}>
                      <h4 className="font-semibold text-gray-800 text-sm mb-2">{title}</h4>
                      {isList ? (
                        <ul className="space-y-1">{(items as string[]).map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}</li>)}</ul>
                      ) : (
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{items[0]}</p>
                      )}
                    </div>
                  ))}
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
