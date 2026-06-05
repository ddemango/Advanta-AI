"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Loader2, CheckCircle } from "lucide-react";
import ToolLayout, { ResultCard, BulletList } from "@/components/tools/ToolLayout";

export default function PricingStrategyPage() {
  const [form, setForm] = useState({ product: "", industry: "", current_price: "", competitors: "", costs: "", target_market: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/pricing-strategy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch { setError("Failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Pricing Strategy Assistant" description="AI-powered pricing analysis with tiered recommendations and revenue projections." icon={<DollarSign className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ k: "product", l: "Product / Service *", p: "e.g. SaaS project management tool" }, { k: "industry", l: "Industry *", p: "e.g. B2B Software" }, { k: "current_price", l: "Current Price (if any)", p: "e.g. $49/month or 'not launched'" }, { k: "competitors", l: "Competitors & Their Prices", p: "e.g. Asana $10-25/user, Monday.com $8-16/user" }, { k: "costs", l: "Your Cost Structure", p: "e.g. $5/user hosting, $10k/month team costs" }, { k: "target_market", l: "Target Market *", p: "e.g. SMBs with 10-50 employees" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required={["product", "industry", "target_market"].includes(k)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            ))}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.product} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing Pricing...</> : <><DollarSign className="w-4 h-4" />Analyze Pricing Strategy</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center"><DollarSign className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">Pricing analysis with tier recommendations will appear here</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
                <p className="text-xs text-green-600 font-semibold uppercase mb-1">Recommended Price</p>
                <p className="text-3xl font-black text-green-700">{result.recommended_price}</p>
                <p className="text-sm text-green-600 mt-1">{result.strategy}</p>
                {result.revenue_projection && <div className="mt-3 bg-white/60 rounded-xl p-3 text-sm text-green-700"><strong>Revenue Projection:</strong> {result.revenue_projection}</div>}
              </div>

              {result.tiers?.length > 0 && (
                <div className="grid gap-3">
                  {result.tiers.map((tier: any, i: number) => (
                    <div key={i} className={`border rounded-2xl p-4 ${i === 1 ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${i === 1 ? "bg-blue-200 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{tier.name}</span>{i === 1 && <span className="text-xs text-blue-600 font-semibold ml-2">⭐ Recommended</span>}</div>
                        <span className="font-black text-lg text-gray-900">{tier.price}</span>
                      </div>
                      <ul className="space-y-1">{tier.features?.map((f: string, j: number) => <li key={j} className="flex items-center gap-2 text-xs text-gray-600"><CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{f}</li>)}</ul>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <ResultCard title="Psych Tactics"><BulletList items={result.psychological_tactics} /></ResultCard>
                <ResultCard title="Risks"><BulletList items={result.risks} icon="⚠" /></ResultCard>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700"><strong>Rationale: </strong>{result.rationale}</div>
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
