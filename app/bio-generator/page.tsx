"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Loader2 } from "lucide-react";
import ToolLayout, { CopyButton, TagList } from "@/components/tools/ToolLayout";

const bioTabs = [
  { key: "linkedin", label: "LinkedIn", color: "bg-blue-600" },
  { key: "twitter", label: "Twitter/X", color: "bg-gray-900" },
  { key: "website_short", label: "Website (Short)", color: "bg-purple-600" },
  { key: "website_long", label: "Website (Long)", color: "bg-indigo-600" },
  { key: "speaker", label: "Speaker Bio", color: "bg-green-600" },
];

export default function BioGeneratorPage() {
  const [form, setForm] = useState({ name: "", role: "", company: "", achievements: "", personality: "professional and approachable", platforms: "LinkedIn, Twitter, Website" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("linkedin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/bio-generator", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate bios."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Bio Generator" description="Professional bios for LinkedIn, Twitter, your website, and speaker profiles." icon={<User className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { k: "name", l: "Your Full Name *", p: "e.g. Alex Johnson" },
              { k: "role", l: "Your Title / Role *", p: "e.g. Founder & CEO at TechCorp" },
              { k: "company", l: "Company / Brand", p: "e.g. TechCorp, Freelance Designer" },
            ].map(({ k, l, p }) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required={["name", "role"].includes(k)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Key Achievements *</label>
              <textarea value={form.achievements} onChange={e => setForm(v => ({ ...v, achievements: e.target.value }))} placeholder="e.g. Built 3 startups, $5M raised, Forbes 30 Under 30, speaker at TED..." rows={3} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Personality / Tone</label>
              <select value={form.personality} onChange={e => setForm(v => ({ ...v, personality: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {["professional and approachable", "bold and confident", "warm and human", "expert and authoritative", "creative and quirky"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.name || !form.role} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Writing 5 Bios...</> : <><User className="w-4 h-4" />Generate All Bios</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center">
              <User className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400">5 platform-specific bios will appear here</p>
              <p className="text-gray-300 text-sm mt-1">LinkedIn · Twitter · Website (short & long) · Speaker</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {result.headline_options?.length > 0 && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-blue-200 uppercase mb-2">Headline Options</p>
                  <ul className="space-y-1">{result.headline_options.map((h: string, i: number) => (
                    <li key={i} className="text-sm text-white font-medium flex items-center justify-between gap-2">
                      <span>{h}</span>
                      <CopyButton text={h} />
                    </li>
                  ))}</ul>
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                {bioTabs.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === tab.key ? `${tab.color} text-white` : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              {result.bios?.[activeTab] && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase">{bioTabs.find(t => t.key === activeTab)?.label} Bio</p>
                    <CopyButton text={result.bios[activeTab]} label="Copy Bio" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result.bios[activeTab]}</p>
                </div>
              )}
              {result.tagline_options?.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-yellow-700 uppercase mb-2">✨ Tagline Options</p>
                  <ul className="space-y-2">{result.tagline_options.map((t: string, i: number) => (
                    <li key={i} className="flex items-center justify-between gap-2 text-sm text-yellow-800 italic bg-white rounded-lg px-3 py-2">
                      <span>"{t}"</span>
                      <CopyButton text={t} />
                    </li>
                  ))}</ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
