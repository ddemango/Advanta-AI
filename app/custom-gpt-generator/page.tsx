"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Loader2, MessageSquare } from "lucide-react";
import ToolLayout, { CopyButton, ResultCard } from "@/components/tools/ToolLayout";

export default function CustomGPTPage() {
  const [form, setForm] = useState({ bot_name: "", purpose: "", industry: "", personality: "professional and helpful", capabilities: "", restrictions: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/custom-gpt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate bot config."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed to generate bot config. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Custom GPT Bot Generator" description="Generate complete system prompts and configurations for your custom AI chatbot." icon={<Bot className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ k: "bot_name", l: "Bot Name *", p: "e.g. SalesBot Pro, HelpDesk AI" }, { k: "purpose", l: "Bot's Purpose *", p: "e.g. Handle customer support for an e-commerce store" }, { k: "industry", l: "Industry *", p: "e.g. E-commerce, Healthcare, SaaS" }, { k: "capabilities", l: "What Should It Do?", p: "e.g. Answer FAQs, qualify leads, book meetings" }, { k: "restrictions", l: "What Should It Avoid?", p: "e.g. Don't discuss pricing, no legal advice" }].map(({ k, l, p }) => (
              <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required={["bot_name", "purpose", "industry"].includes(k)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            ))}
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Personality Style</label>
              <select value={form.personality} onChange={e => setForm(v => ({ ...v, personality: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {["professional and helpful", "friendly and casual", "concise and direct", "empathetic and warm", "expert and authoritative"].map(p => <option key={p}>{p}</option>)}
              </select></div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.bot_name} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Building Bot Config...</> : <><Bot className="w-4 h-4" />Generate Bot Config</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center"><Bot className="w-12 h-12 text-gray-200 mb-3" /><p className="text-gray-400">System prompt and full bot configuration will appear here</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-gray-900 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase">System Prompt</span>
                  <CopyButton text={result.system_prompt} label="Copy Prompt" />
                </div>
                <p className="text-sm text-green-400 font-mono leading-relaxed whitespace-pre-wrap">{result.system_prompt}</p>
              </div>
              {result.starter_messages?.length > 0 && (
                <ResultCard title="Starter Messages">
                  <div className="space-y-2">{result.starter_messages.map((m: string, i: number) => <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-sm text-blue-700 flex items-center justify-between gap-2"><span>"{m}"</span><CopyButton text={m} /></div>)}</div>
                </ResultCard>
              )}
              {result.example_conversations?.length > 0 && (
                <ResultCard title="Example Conversations">
                  {result.example_conversations.map((conv: any, i: number) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <div className="flex justify-end mb-1"><div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-3 py-2 text-xs max-w-xs">{conv.user}</div></div>
                      <div className="flex justify-start"><div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-3 py-2 text-xs max-w-xs"><span className="font-semibold text-blue-600">{result.name}: </span>{conv.assistant}</div></div>
                    </div>
                  ))}
                </ResultCard>
              )}
              {result.deployment_tips?.length > 0 && <div className="bg-green-50 border border-green-200 rounded-xl p-4"><p className="text-xs font-semibold text-green-700 uppercase mb-2">🚀 Deployment Tips</p><ul className="space-y-1">{result.deployment_tips.map((t: string, i: number) => <li key={i} className="text-sm text-green-700">• {t}</li>)}</ul></div>}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
