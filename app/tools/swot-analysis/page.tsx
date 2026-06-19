"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Target, ArrowLeft, Loader2, TrendingUp, TrendingDown, Zap, AlertTriangle } from "lucide-react";

interface SwotData {
  company: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export default function SwotPage() {
  const [form, setForm] = useState({ company: "", industry: "", description: "", goals: "", challenges: "" });
  const [result, setResult] = useState<SwotData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/swot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate SWOT."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to generate SWOT. Please try again."); }
    finally { setLoading(false); }
  };

  const quadrants = result ? [
    { label: "Strengths", items: result.strengths, icon: TrendingUp, color: "bg-green-50 border-green-200", headerColor: "bg-green-100 text-green-700" },
    { label: "Weaknesses", items: result.weaknesses, icon: TrendingDown, color: "bg-red-50 border-red-200", headerColor: "bg-red-100 text-red-700" },
    { label: "Opportunities", items: result.opportunities, icon: Zap, color: "bg-blue-50 border-blue-200", headerColor: "bg-blue-100 text-blue-700" },
    { label: "Threats", items: result.threats, icon: AlertTriangle, color: "bg-yellow-50 border-yellow-200", headerColor: "bg-yellow-100 text-yellow-700" },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/free-tools" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Free Tools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Target className="w-5 h-5 text-blue-600" /></div>
            <h1 className="text-3xl font-bold text-gray-900">SWOT Analysis Generator</h1>
          </div>
          <p className="text-gray-600 mb-8">AI-powered strategic analysis to identify your competitive position.</p>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              {[
                { key: "company", label: "Company Name *", placeholder: "Your company name" },
                { key: "industry", label: "Industry", placeholder: "e.g. SaaS, E-commerce, Healthcare" },
                { key: "description", label: "Business Description", placeholder: "Brief description of what you do" },
                { key: "goals", label: "Strategic Goals", placeholder: "e.g. Expand to EU market, grow ARR 2x" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type="text" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} required={key === "company"} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Challenges</label>
                <input type="text" value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} placeholder="e.g. Increasing competition, rising CAC" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {error && <p className="sm:col-span-2 text-red-600 text-sm">{error}</p>}
              <div className="sm:col-span-2">
                <button type="submit" disabled={loading || !form.company} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : "Generate SWOT Analysis"}
                </button>
              </div>
            </form>
          </div>

          {/* Result */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">SWOT Analysis: {result.company}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quadrants.map((q) => (
                  <div key={q.label} className={`border rounded-2xl overflow-hidden ${q.color}`}>
                    <div className={`flex items-center gap-2 px-4 py-3 ${q.headerColor}`}>
                      <q.icon className="w-4 h-4" />
                      <span className="font-semibold text-sm">{q.label}</span>
                    </div>
                    <ul className="p-4 space-y-2">
                      {q.items?.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 flex-shrink-0 opacity-50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
