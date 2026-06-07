"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { workflows, workflowCategories, colorMap, type Workflow } from "@/lib/workflows-data";
import {
  Search, X, ChevronDown, ChevronUp, CheckCircle, Star, Zap, ArrowRight,
  Clock, Users, ShieldCheck, Package, Play, Mail,
  SlidersHorizontal, Sparkles, BadgeCheck,
} from "lucide-react";

// ─── WORKFLOW CARD ────────────────────────────────────────────────────────────
function WorkflowCard({ wf, onSelect }: { wf: Workflow; onSelect: (w: Workflow) => void }) {
  const c = colorMap[wf.color] ?? colorMap.blue;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
      onClick={() => onSelect(wf)}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${wf.gradient}`} />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{wf.icon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {wf.bestseller && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" /> Bestseller
                  </span>
                )}
                {wf.popular && !wf.bestseller && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Popular</span>
                )}
                {wf.new && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">New</span>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 block ${c.text}`}>{wf.category}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-gray-900">${wf.price}</div>
            <div className="text-xs text-gray-400">{wf.priceType === "one-time" ? "one-time" : "/month"}</div>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
          {wf.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{wf.tagline}</p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {wf.metrics.map((m, i) => (
            <div key={i} className={`${c.light} rounded-lg p-2 text-center`}>
              <div className={`text-sm font-bold ${c.text}`}>{m.value}</div>
              <div className="text-xs text-gray-500 leading-tight">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {wf.tools.slice(0, 4).map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
          ))}
          {wf.tools.length > 4 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{wf.tools.length - 4} more</span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {wf.setupTime}</span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${
              wf.complexity === "Beginner" ? "bg-green-100 text-green-700" :
              wf.complexity === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>{wf.complexity}</span>
          </div>
          <button
            className={`text-xs font-semibold ${c.text} flex items-center gap-1 group-hover:gap-2 transition-all`}
            onClick={(e) => { e.stopPropagation(); onSelect(wf); }}
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── DETAIL PANEL ─────────────────────────────────────────────────────────────
function DetailPanel({ wf, onClose, onPurchase }: { wf: Workflow; onClose: () => void; onPurchase: (w: Workflow) => void }) {
  const c = colorMap[wf.color] ?? colorMap.blue;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-2 w-full bg-gradient-to-r ${wf.gradient} rounded-t-3xl`} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{wf.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.light} ${c.text}`}>{wf.category}</span>
                  {wf.bestseller && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><Star className="w-3 h-3" /> Bestseller</span>}
                  {wf.new && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">New</span>}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{wf.name}</h2>
                <p className={`text-sm font-medium mt-0.5 ${c.text}`}>{wf.tagline}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{wf.description}</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {wf.metrics.map((m, i) => (
              <div key={i} className={`${c.light} rounded-xl p-3 text-center`}>
                <div className={`text-xl font-bold ${c.text}`}>{m.value}</div>
                <div className="text-xs text-gray-600 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Play className="w-4 h-4 text-gray-400" /> How It Works
            </h3>
            <ol className="space-y-2">
              {wf.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className={`w-5 h-5 rounded-full ${c.bg} text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold`}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" /> What's Included
            </h3>
            <ul className="space-y-2">
              {wf.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${c.text}`} />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-400" /> Integrations
            </h3>
            <div className="flex flex-wrap gap-2">
              {wf.tools.map((t) => (
                <span key={t} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Best For</h3>
            <div className="flex flex-wrap gap-2">
              {wf.useCases.map((u) => (
                <span key={u} className={`text-sm ${c.light} ${c.text} px-3 py-1 rounded-full font-medium`}>{u}</span>
              ))}
            </div>
          </div>

          {wf.testimonial && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}</div>
              <p className="text-sm text-gray-700 italic mb-2">"{wf.testimonial.quote}"</p>
              <p className="text-xs text-gray-500 font-semibold">{wf.testimonial.author} · {wf.testimonial.role}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {wf.setupTime} setup</span>
            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium text-xs ${
              wf.complexity === "Beginner" ? "bg-green-100 text-green-700" :
              wf.complexity === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>{wf.complexity}</span>
            <span className="flex items-center gap-1.5 text-green-600 font-semibold"><ShieldCheck className="w-4 h-4" /> 30-day guarantee</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => onPurchase(wf)}
              className={`flex-1 bg-gradient-to-r ${wf.gradient} text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2`}
            >
              <Zap className="w-5 h-5" />
              Get This Workflow — ${wf.price}
            </button>
            <button onClick={onClose} className="px-6 py-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">
              Close
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">One-time payment · Instant delivery · 30-day money-back guarantee</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── PURCHASE MODAL ──────────────────────────────────────────────────────────
function PurchaseModal({ wf, onClose }: { wf: Workflow; onClose: () => void }) {
  const c = colorMap[wf.color] ?? colorMap.blue;
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/marketplace/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, workflow: wf.name, price: wf.price }),
      });
    } catch {}
    setSent(true);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Received!</h3>
            <p className="text-gray-600 mb-2">We'll send your workflow files and setup guide to <strong>{form.email}</strong> within a few hours.</p>
            <p className="text-sm text-gray-400 mb-6">Questions? Reply to that email or reach us at hello@advanta-ai.com</p>
            <button onClick={onClose} className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Purchase Workflow</h3>
                <p className={`text-sm font-medium ${c.text} mt-0.5`}>{wf.name}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className={`${c.light} rounded-xl p-4 mb-6 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wf.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{wf.name}</div>
                  <div className="text-xs text-gray-500">One-time · Instant delivery</div>
                </div>
              </div>
              <div className={`text-2xl font-bold ${c.text}`}>${wf.price}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { k: "name", l: "Full Name *", p: "Your name", t: "text" },
                { k: "email", l: "Email Address *", p: "you@company.com", t: "email" },
                { k: "company", l: "Company", p: "Company name (optional)", t: "text" },
              ].map(({ k, l, p, t }) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                  <input
                    type={t}
                    required={["name", "email"].includes(k)}
                    value={(form as any)[k]}
                    onChange={(e) => setForm((v) => ({ ...v, [k]: e.target.value }))}
                    placeholder={p}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Your current setup (optional)</label>
                <textarea
                  rows={2}
                  value={form.message}
                  onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))}
                  placeholder="Tools you use, team size, specific needs..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !form.name || !form.email}
                className={`w-full bg-gradient-to-r ${wf.gradient} text-white py-3.5 rounded-xl font-bold text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {loading ? "Processing..." : <><Zap className="w-4 h-4" /> Complete Purchase — ${wf.price}</>}
              </button>
              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 30-day money-back guarantee · Secure checkout
              </p>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  { q: "What exactly is a plug-and-play workflow?", a: "Each workflow is a pre-built automation blueprint — complete with templates, logic flows, copy, and a step-by-step setup guide. You're not buying code; you're buying a proven system you connect to your own tools in under 2 hours." },
  { q: "Which tools do I need to already have?", a: "Each workflow card lists the tools it connects. Most use apps you likely already have (Gmail, Slack, HubSpot, Shopify). We also note which are free-tier compatible. If you're unsure, reach out before purchasing." },
  { q: "Do I need a developer or technical skills?", a: "No developer needed. Beginner-level workflows use no-code tools (Zapier, Make). Intermediate/Advanced ones are still no-code but require more setup time and configuration. Each comes with a video walkthrough." },
  { q: "What if it doesn't work for my setup?", a: "We offer a 30-day money-back guarantee, no questions asked. If the workflow doesn't fit your tech stack or you can't get it running, email us and we'll either fix it or refund you." },
  { q: "How is this delivered after purchase?", a: "Within a few hours of your order, you'll receive an email with: (1) download link for templates/blueprints, (2) step-by-step setup guide PDF, (3) video walkthrough link, and (4) access to our private support channel." },
  { q: "Can I request a custom workflow?", a: "Yes! If none of the existing workflows match your exact use case, contact us for a custom build. We scope and deliver fully custom automation workflows for businesses of all sizes." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button className="w-full flex items-center justify-between py-5 text-left gap-4" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-gray-900">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pb-5 text-gray-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "newest">("popular");
  const [selected, setSelected] = useState<Workflow | null>(null);
  const [purchasing, setPurchasing] = useState<Workflow | null>(null);
  const [email, setEmail] = useState("");
  const [waitlistSent, setWaitlistSent] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = workflows
    .filter((w) => {
      const q = search.toLowerCase();
      const matchSearch = !q || w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q) || w.category.toLowerCase().includes(q) || w.tools.some((t) => t.toLowerCase().includes(q));
      const matchCat = activeCategory === "all" || w.category === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return (b.new ? 1 : 0) - (a.new ? 1 : 0);
      return (b.bestseller ? 2 : b.popular ? 1 : 0) - (a.bestseller ? 2 : a.popular ? 1 : 0);
    });

  const handlePurchase = (wf: Workflow) => {
    setSelected(null);
    setTimeout(() => setPurchasing(wf), 150);
  };

  const featuredWorkflows = workflows.filter((w) => w.bestseller || w.popular).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                {workflows.length} Pre-Built AI Workflows — Ready to Deploy
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Plug-and-Play AI Workflows<br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Built for Your Business
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Stop wasting weeks building automations from scratch. Browse battle-tested workflows by category, purchase instantly, and deploy in hours — no developers needed.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> No coding required</span>
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-400" /> 30-day guarantee</span>
                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> Deploy in hours</span>
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-400" /> 500+ businesses using</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-14 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">Top Workflows This Month</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredWorkflows.map((wf) => {
              const c = colorMap[wf.color] ?? colorMap.blue;
              return (
                <div
                  key={wf.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => setSelected(wf)}
                >
                  <div className={`h-1 w-full bg-gradient-to-r ${wf.gradient} rounded-full mb-4`} />
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{wf.icon}</span>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-xl">${wf.price}</div>
                      <div className="text-xs text-gray-400">one-time</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{wf.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{wf.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${c.light} ${c.text} px-2 py-0.5 rounded-full font-medium`}>{wf.category}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePurchase(wf); }}
                      className={`text-xs font-semibold bg-gradient-to-r ${wf.gradient} text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN CATALOG */}
      <section className="py-14" ref={gridRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category tabs */}
          <div className="flex overflow-x-auto gap-2 pb-3 mb-8">
            {workflowCategories.map((cat) => {
              const count = cat.id === "all" ? workflows.length : workflows.filter((w) => w.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    activeCategory === cat.id
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by workflow name, tool, or use case..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing <strong className="text-gray-900">{filtered.length}</strong> workflows
              {activeCategory !== "all" && <> in <strong className="text-gray-900">{activeCategory}</strong></>}
            </p>
            {(search || activeCategory !== "all") && (
              <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No workflows found</h3>
              <p className="text-gray-400">Try a different category or search term.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((wf) => (
                  <WorkflowCard key={wf.id} wf={wf} onSelect={setSelected} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Deploy a Workflow in 4 Steps</h2>
            <p className="text-gray-600 text-lg">No developers. No months of setup. Just results.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", icon: "🔍", title: "Browse & Choose", desc: "Filter by category, review integrations and deliverables. Find your perfect match." },
              { step: "02", icon: "💳", title: "Purchase Instantly", desc: "One-time payment. No subscriptions. Immediate confirmation sent to your email." },
              { step: "03", icon: "📦", title: "Receive Your Kit", desc: "Templates, automation blueprints, copy, and a step-by-step video walkthrough." },
              { step: "04", icon: "🚀", title: "Go Live Today", desc: "Follow the guide, connect your tools, hit activate. Live within 2 hours." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative mb-4 inline-block">
                  <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-sm">{icon}</div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{step}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck className="w-6 h-6 text-green-600" />, bg: "bg-green-50", title: "30-Day Guarantee", desc: "Full refund if it doesn't work for your setup." },
              { icon: <Zap className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50", title: "Instant Delivery", desc: "Files and guide sent within hours of purchase." },
              { icon: <BadgeCheck className="w-6 h-6 text-purple-600" />, bg: "bg-purple-50", title: "Battle-Tested", desc: "Every workflow runs live in 500+ real businesses." },
              { icon: <Users className="w-6 h-6 text-orange-600" />, bg: "bg-orange-50", title: "Setup Support", desc: "Stuck? Email us. Real humans reply within 24 hrs." },
            ].map(({ icon, bg, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know before purchasing.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* CUSTOM CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-violet-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🛠️</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need a Custom Workflow?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't see exactly what you need? We build fully custom AI automation workflows tailored to your stack, team, and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg">
              <Mail className="w-5 h-5" /> Request Custom Workflow
            </Link>
            <Link href="/free-tools" className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all">
              <Zap className="w-5 h-5" /> Try Free Tools First
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 max-w-md mx-auto">
            <p className="text-white font-semibold mb-1">🔔 New Workflows Every Month</p>
            <p className="text-blue-200 text-sm mb-4">Get notified when new categories drop.</p>
            {waitlistSent ? (
              <div className="flex items-center justify-center gap-2 text-green-300 font-semibold">
                <CheckCircle className="w-5 h-5" /> You're on the list!
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setWaitlistSent(true); }} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-gray-900 text-sm focus:outline-none"
                />
                <button type="submit" className="bg-white text-blue-600 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors flex-shrink-0">
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {selected && <DetailPanel wf={selected} onClose={() => setSelected(null)} onPurchase={handlePurchase} />}
      </AnimatePresence>
      <AnimatePresence>
        {purchasing && <PurchaseModal wf={purchasing} onClose={() => setPurchasing(null)} />}
      </AnimatePresence>
    </div>
  );
}
