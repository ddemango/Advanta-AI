"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, ArrowLeft, Loader2, Globe, Zap, BarChart3, TrendingUp } from "lucide-react";

interface CompetitorData {
  domain: string;
  tech: { frameworks: string[]; cms: string | null; thirdParties: string[] };
  performance: { weightKB: number; reqImages: number; reqScripts: number };
  seo: { title: string; metaDescription: string; headings: { h1: number; h2: number; h3: number } };
  score: { total: number; performance: number; seo: number; tech: number };
  insights: string[];
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-green-500" : value >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}/100</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, delay: 0.3 }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  );
}

export default function CompetitorLitePage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<CompetitorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/competitor-lite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch { setError("Failed to analyze. Please check the URL and try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/free-tools" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-8"><ArrowLeft className="w-4 h-4" /> Back to Free Tools</Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Search className="w-5 h-5 text-blue-600" /></div>
            <h1 className="text-3xl font-bold text-gray-900">Competitor Intel Scanner</h1>
          </div>
          <p className="text-gray-600 mb-8">Drop in a competitor URL. Get their tech stack, SEO profile, performance metrics, and strategic insights instantly.</p>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="e.g. https://competitor.com" required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" disabled={loading || !url} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</> : <><Search className="w-4 h-4" /> Scan Now</>}
              </button>
            </form>
            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
          </div>

          {result && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Analysis: {result.domain}</h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Overall Score", value: result.score?.total, icon: TrendingUp, color: "blue" },
                  { label: "Performance", value: result.score?.performance, icon: Zap, color: "green" },
                  { label: "SEO Score", value: result.score?.seo, icon: Search, color: "purple" },
                  { label: "Tech Stack", value: result.score?.tech, icon: BarChart3, color: "orange" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-blue-600 mb-1">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Score Breakdown</h3>
                  <div className="space-y-4">
                    <ScoreBar label="Performance" value={result.score?.performance || 0} />
                    <ScoreBar label="SEO" value={result.score?.seo || 0} />
                    <ScoreBar label="Tech Stack" value={result.score?.tech || 0} />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Technology Stack</h3>
                  <div className="space-y-3">
                    {result.tech?.frameworks?.length > 0 && (
                      <div><div className="text-xs text-gray-500 mb-1">Frameworks</div><div className="flex flex-wrap gap-1.5">{result.tech.frameworks.map((f, i) => <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{f}</span>)}</div></div>
                    )}
                    {result.tech?.cms && <div><div className="text-xs text-gray-500 mb-1">CMS</div><span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">{result.tech.cms}</span></div>}
                    {result.tech?.thirdParties?.length > 0 && (
                      <div><div className="text-xs text-gray-500 mb-1">3rd Party Tools</div><div className="flex flex-wrap gap-1.5">{result.tech.thirdParties.map((t, i) => <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{t}</span>)}</div></div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">SEO Profile</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Title:</span> <span className="text-gray-800">{result.seo?.title}</span></div>
                    <div><span className="text-gray-500">Meta Desc:</span> <span className="text-gray-800">{result.seo?.metaDescription}</span></div>
                    <div className="flex gap-4 mt-2">
                      {Object.entries(result.seo?.headings || {}).map(([tag, count]) => (
                        <div key={tag} className="text-center"><div className="font-bold text-blue-600">{count as number}</div><div className="text-xs text-gray-500">{tag.toUpperCase()}</div></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Strategic Insights</h3>
                  <ul className="space-y-2">
                    {result.insights?.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />{insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
