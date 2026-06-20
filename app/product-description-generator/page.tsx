"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2 } from "lucide-react";
import ToolLayout, { CopyButton, TagList, ResultCard } from "@/components/tools/ToolLayout";

export default function ProductDescriptionPage() {
  const [form, setForm] = useState({ product_name: "", category: "", features: "", audience: "", tone: "persuasive and friendly", platform: "Shopify / Amazon" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/product-description", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate description."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Product Description Generator" description="High-converting product descriptions for Shopify, Amazon, Etsy, and more." icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { k: "product_name", l: "Product Name *", p: "e.g. Wireless Noise-Cancelling Headphones" },
              { k: "category", l: "Category", p: "e.g. Electronics, Skincare, Home Decor" },
            ].map(({ k, l, p }) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required={k === "product_name"} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Key Features & Details *</label>
              <textarea value={form.features} onChange={e => setForm(v => ({ ...v, features: e.target.value }))} placeholder="List the key features, specs, materials, dimensions, benefits..." rows={4} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Target Audience</label>
              <input value={form.audience} onChange={e => setForm(v => ({ ...v, audience: e.target.value }))} placeholder="e.g. remote workers, fitness enthusiasts, new parents" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "platform", l: "Platform", opts: ["Shopify / Amazon", "Etsy", "eBay", "WooCommerce", "Instagram Shop", "General"] },
                { k: "tone", l: "Tone", opts: ["persuasive and friendly", "luxury and premium", "technical and detailed", "fun and playful", "minimalist and clean"] },
              ].map(({ k, l, opts }) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <select value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.product_name || !form.features} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Writing Description...</> : <><ShoppingBag className="w-4 h-4" />Generate Descriptions</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400">Short, long, bullet points, SEO title & more will appear here</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 text-white">
                <p className="text-xs font-semibold text-blue-200 uppercase mb-1">SEO Title</p>
                <p className="font-bold">{result.seo_title}</p>
                <div className="mt-2"><CopyButton text={result.seo_title} /></div>
              </div>
              <ResultCard title="Short Description">
                <p className="text-sm text-gray-700 leading-relaxed">{result.short_description}</p>
                <div className="mt-3 flex justify-end"><CopyButton text={result.short_description} /></div>
              </ResultCard>
              <ResultCard title="Full Description">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result.long_description}</p>
                <div className="mt-3 flex justify-end"><CopyButton text={result.long_description} /></div>
              </ResultCard>
              {result.bullet_points?.length > 0 && (
                <ResultCard title="Bullet Points">
                  <ul className="space-y-2">{result.bullet_points.map((b: string, i: number) => <li key={i} className="flex gap-2 text-sm text-gray-700"><span className="text-blue-500 flex-shrink-0">✓</span>{b}</li>)}</ul>
                  <div className="mt-3 flex justify-end"><CopyButton text={result.bullet_points.map((b: string) => `• ${b}`).join("\n")} label="Copy Bullets" /></div>
                </ResultCard>
              )}
              {result.meta_description && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Meta Description</p>
                  <p className="text-sm text-gray-700">{result.meta_description}</p>
                  <div className="mt-2 flex justify-end"><CopyButton text={result.meta_description} /></div>
                </div>
              )}
              {result.amazon_backend_keywords?.length > 0 && (
                <ResultCard title="Backend Keywords (Amazon)">
                  <TagList items={result.amazon_backend_keywords} color="purple" />
                </ResultCard>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
