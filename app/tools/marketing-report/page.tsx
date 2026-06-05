"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BarChart3, ArrowLeft, Download, Loader2, TrendingUp, Target, Lightbulb } from "lucide-react";

interface ReportData {
  brand: string;
  period: string;
  kpis: { name: string; value: string; delta: string }[];
  insights: {
    channels: { channel: string; summary: string }[];
    recommendations: string[];
  };
}

export default function MarketingReportPage() {
  const [form, setForm] = useState({ brand: "", period: "", channels: "", goals: "", budget: "", metrics: "" });
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/marketing-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setReport(await res.json());
    } catch { setError("Failed to generate report. Please check your API key and try again."); }
    finally { setLoading(false); }
  };

  const download = () => {
    if (!report) return;
    const txt = [`MARKETING REPORT — ${report.brand}`, `Period: ${report.period}`, "", "KEY KPIS:", ...report.kpis.map(k => `• ${k.name}: ${k.value} (${k.delta})`), "", "CHANNEL INSIGHTS:", ...report.insights.channels.map(c => `• ${c.channel}: ${c.summary}`), "", "RECOMMENDATIONS:", ...report.insights.recommendations.map((r, i) => `${i + 1}. ${r}`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
    a.download = `marketing-report-${report.brand.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/free-tools" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Free Tools
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Report Generator</h1>
          </div>
          <p className="text-gray-600 mb-8">Generate comprehensive AI-powered marketing reports with KPI analysis and actionable recommendations.</p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Report Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "brand", label: "Brand / Company Name *", placeholder: "e.g. Acme Corp" },
                  { key: "period", label: "Reporting Period", placeholder: "e.g. Q4 2024, Last 30 days" },
                  { key: "channels", label: "Marketing Channels", placeholder: "e.g. Google Ads, SEO, Email, Social" },
                  { key: "goals", label: "Campaign Goals", placeholder: "e.g. Lead generation, Brand awareness" },
                  { key: "budget", label: "Marketing Budget", placeholder: "e.g. $10,000/month" },
                  { key: "metrics", label: "Key Metrics to Analyze", placeholder: "e.g. CTR, conversion rate, ROAS" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type="text"
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      required={key === "brand"}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !form.brand}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : "Generate Report"}
                </button>
              </form>
            </div>

            {/* Result */}
            <div>
              {!report ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full flex flex-col items-center justify-center text-center">
                  <BarChart3 className="w-12 h-12 text-gray-200 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">Your report will appear here</h3>
                  <p className="text-gray-400 text-sm">Fill in your details and click Generate Report.</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Report: {report.brand}</h3>
                      <button onClick={download} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {report.kpis?.map((kpi, i) => (
                        <div key={i} className="bg-blue-50 rounded-xl p-3">
                          <div className="text-xs text-gray-500 mb-1">{kpi.name}</div>
                          <div className="font-bold text-gray-900">{kpi.value}</div>
                          <div className={`text-xs font-medium ${kpi.delta?.startsWith("+") ? "text-green-600" : "text-red-500"}`}>{kpi.delta}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-gray-800 text-sm">Channel Insights</h4>
                      </div>
                      <div className="space-y-2">
                        {report.insights?.channels?.map((c, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-medium text-gray-700">{c.channel}:</span>{" "}
                            <span className="text-gray-600">{c.summary}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <h4 className="font-semibold text-gray-800 text-sm">Recommendations</h4>
                      </div>
                      <ol className="space-y-1.5">
                        {report.insights?.recommendations?.map((r, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-700">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                            {r}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
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
