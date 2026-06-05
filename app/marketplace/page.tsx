"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { agents, categories, colorMap, type Agent } from "@/lib/agents-data";
import {
  Search, Star, Crown, ArrowRight, CheckCircle, X, Zap, Users,
  TrendingUp, ChevronDown, ChevronUp, Play, Shield, Clock, ExternalLink,
  MessageSquare, BarChart3, Loader2,
} from "lucide-react";

// ── Demo Request Modal ──────────────────────────────────────────────────────
function DemoModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await fetch("/api/marketplace/demo-request", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, agent: agent.name }),
      });
      setDone(true);
    } catch { setDone(true); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className={`bg-gradient-to-r ${agent.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Request a Demo</p>
              <h3 className="text-xl font-bold mt-1">{agent.name}</h3>
              <p className="text-white/80 text-sm mt-1">{agent.tagline}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Demo Requested! 🎉</h4>
              <p className="text-gray-500 text-sm">Our team will reach out within 24 hours to schedule your personalized demo.</p>
              <button onClick={onClose} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[{ k: "name", l: "Your Name", p: "Jane Smith" }, { k: "company", l: "Company", p: "Acme Inc." }].map(({ k, l, p }) => (
                  <div key={k}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                    <input value={(form as any)[k]} onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))} placeholder={p} required={k === "name"}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Work Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} placeholder="jane@company.com" required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">What would you like to achieve?</label>
                <textarea value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} placeholder="Tell us about your use case..."
                  rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <button type="submit" disabled={submitting || !form.email || !form.name}
                className={`w-full bg-gradient-to-r ${agent.gradient} text-white py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2`}>
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</> : <><Play className="w-4 h-4" />Schedule My Demo</>}
              </button>
              <p className="text-xs text-center text-gray-400">Free demo · No commitment · Response within 24h</p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Agent Detail Panel ──────────────────────────────────────────────────────
function AgentPanel({ agent, onClose, onDemo }: { agent: Agent; onClose: () => void; onDemo: () => void }) {
  const c = colorMap[agent.color] || colorMap.blue;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${agent.gradient} p-6 sm:p-8 text-white relative`}>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{agent.icon}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">{agent.category}</span>
                {agent.popular && <span className="text-xs font-semibold bg-yellow-400/90 text-yellow-900 px-2 py-0.5 rounded-full flex items-center gap-1"><Crown className="w-3 h-3" />Most Popular</span>}
                {agent.new && <span className="text-xs font-semibold bg-green-400/90 text-green-900 px-2 py-0.5 rounded-full">New</span>}
              </div>
              <h2 className="text-2xl font-bold mt-2">{agent.name}</h2>
              <p className="text-white/80 mt-1">{agent.tagline}</p>
            </div>
          </div>
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {agent.metrics.map((m, i) => (
              <div key={i} className="bg-white/15 rounded-2xl p-3 text-center backdrop-blur-sm">
                <div className="font-black text-lg">{m.value}</div>
                <div className="text-white/70 text-xs mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-600 leading-relaxed">{agent.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">What's included</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {agent.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Integrates with</h3>
            <div className="flex flex-wrap gap-2">
              {agent.integrations.map((int, i) => (
                <span key={i} className={`text-xs font-medium px-3 py-1.5 rounded-full border ${c.border} ${c.light} ${c.text}`}>{int}</span>
              ))}
            </div>
          </div>

          {/* Deploy time & rating */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-gray-900">{agent.deployTime}</div>
              <div className="text-xs text-gray-500">Avg. deploy time</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(agent.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}
              </div>
              <div className="font-bold text-gray-900">{agent.rating} / 5.0</div>
              <div className="text-xs text-gray-500">{agent.reviews} reviews</div>
            </div>
          </div>

          {/* Testimonial */}
          {agent.testimonial && (
            <div className={`${c.light} border ${c.border} rounded-2xl p-5`}>
              <p className={`text-sm italic ${c.text} leading-relaxed mb-3`}>"{agent.testimonial.quote}"</p>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 ${c.bg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>{agent.testimonial.author[0]}</div>
                <div><div className="text-sm font-semibold text-gray-900">{agent.testimonial.author}</div><div className="text-xs text-gray-500">{agent.testimonial.company}</div></div>
              </div>
            </div>
          )}

          {/* Pricing & CTA */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-3xl font-black text-gray-900">${agent.price}</span>
                <span className="text-gray-500 ml-1">{agent.priceNote}</span>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center gap-1 justify-end"><Shield className="w-4 h-4 text-green-500" />30-day guarantee</div>
                <div>Dedicated onboarding included</div>
              </div>
            </div>
            <button
              onClick={onDemo}
              className={`w-full bg-gradient-to-r ${agent.gradient} text-white py-4 rounded-2xl font-bold text-lg transition-all hover:opacity-90 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg`}
            >
              <Play className="w-5 h-5" />
              Schedule a Free Demo
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">No credit card required · Setup in {agent.deployTime}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Agent Card ──────────────────────────────────────────────────────────────
function AgentCard({ agent, onView, onDemo }: { agent: Agent; onView: () => void; onDemo: () => void }) {
  const c = colorMap[agent.color] || colorMap.blue;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      onClick={onView}
    >
      {/* Card top gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${agent.gradient}`} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl ${c.light} flex items-center justify-center text-2xl`}>{agent.icon}</div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {agent.popular && <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-0.5"><Crown className="w-3 h-3" />Popular</span>}
            {agent.new && <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">New</span>}
            {agent.enterprise && <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Enterprise</span>}
          </div>
        </div>

        <p className={`text-xs font-semibold uppercase tracking-wide ${c.text} mb-1`}>{agent.category}</p>
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{agent.name}</h3>
        <p className="text-sm text-gray-500 mb-3 font-medium">{agent.tagline}</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{agent.description}</p>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {agent.metrics.slice(0, 3).map((m, i) => (
            <div key={i} className={`${c.light} rounded-xl p-2 text-center`}>
              <div className={`text-xs font-black ${c.text}`}>{m.value}</div>
              <div className="text-xs text-gray-400 leading-tight mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Rating & deploy */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(agent.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}</div>
            <span className="font-medium text-gray-600">{agent.rating}</span>
            <span>({agent.reviews})</span>
          </div>
          <div className="flex items-center gap-1"><Clock className="w-3 h-3" />Live in {agent.deployTime}</div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {agent.tags.map((tag, i) => (
            <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.light} ${c.text}`}>{tag}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div>
            <span className="text-2xl font-black text-gray-900">${agent.price}</span>
            <span className="text-xs text-gray-400">{agent.priceNote}</span>
          </div>
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <button onClick={onView} className={`text-sm border ${c.border} ${c.text} hover:${c.light} px-3 py-2 rounded-xl font-medium transition-colors`}>
              Details
            </button>
            <button
              onClick={onDemo}
              className={`text-sm text-white bg-gradient-to-r ${agent.gradient} px-4 py-2 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-105 flex items-center gap-1`}
            >
              <Play className="w-3 h-3" /> Demo
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [demoAgent, setDemoAgent] = useState<Agent | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  const filtered = agents
    .filter(a => {
      const q = search.toLowerCase();
      return (category === "All" || a.category === category) &&
        (!q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)));
    })
    .sort((a, b) => {
      if (sort === "popular") return b.reviews - a.reviews;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return 0;
    });

  const featuredAgents = agents.filter(a => a.popular).slice(0, 3);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistLoading(true);
    try {
      await fetch("/api/waitlist/marketplace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: waitlistEmail }) });
      setWaitlistDone(true);
    } catch { setWaitlistDone(true); }
    finally { setWaitlistLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── Hero ── */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-yellow-400/15 text-yellow-300 border border-yellow-400/25 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Crown className="w-4 h-4" /> Premium AI Agents Marketplace
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Deploy AI Agents<br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                That Actually Work
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              12 battle-tested AI agents for sales, marketing, operations, and more.
              Each one delivers measurable ROI from day one — or your money back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#agents" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/30">
                Browse AI Agents <ArrowRight className="w-5 h-5" />
              </a>
              <button
                onClick={() => setDemoAgent(agents[0])}
                className="inline-flex items-center justify-center gap-2 border border-white/25 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                <Play className="w-5 h-5" /> See a Live Demo
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {[
              { v: "12", l: "AI Agents" },
              { v: "$10M+", l: "ROI Delivered" },
              { v: "500+", l: "Happy Clients" },
              { v: "24/7", l: "Support Included" },
            ].map((s, i) => (
              <div key={i} className="text-center bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <div className="text-2xl font-black text-white">{s.v}</div>
                <div className="text-sm text-gray-400 mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Agents ── */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center"><Crown className="w-4 h-4 text-yellow-600" /></div>
            <h2 className="text-xl font-bold text-gray-900">Most Popular This Month</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredAgents.map((agent, i) => {
              const c = colorMap[agent.color] || colorMap.blue;
              return (
                <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 ${c.light} rounded-xl flex items-center justify-center text-xl`}>{agent.icon}</div>
                    <div><p className={`text-xs font-semibold ${c.text}`}>{agent.category}</p><p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{agent.name}</p></div>
                    <span className="ml-auto text-2xl font-black text-gray-900">${agent.price}<span className="text-xs text-gray-400 font-normal">/mo</span></span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{agent.tagline}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{agent.rating}</span>
                      <span className="text-xs text-gray-400">({agent.reviews})</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setDemoAgent(agent); }}
                      className={`text-sm text-white bg-gradient-to-r ${agent.gradient} px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-1`}>
                      <Play className="w-3 h-3" /> Demo
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── All Agents ── */}
      <section id="agents" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search agents by name, category, or use case..."
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-3.5 border border-gray-200 rounded-2xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700">
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === cat ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {cat} {cat === "All" ? `(${agents.length})` : `(${agents.filter(a => a.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 mb-6">{filtered.length} agent{filtered.length !== 1 ? "s" : ""} found</p>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map(agent => (
                <AgentCard key={agent.id} agent={agent}
                  onView={() => setSelectedAgent(agent)}
                  onDemo={() => { setSelectedAgent(null); setDemoAgent(agent); }}
                />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500">No agents found</h3>
              <p className="text-gray-400 text-sm mt-1">Try a different search term or category</p>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">From Browse to Live in Days</h2>
            <p className="text-xl text-gray-500">No engineers needed. Our team handles everything.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {[
              { step: "01", icon: Search, title: "Choose an Agent", desc: "Browse our catalog. Filter by category, budget, or use case." },
              { step: "02", icon: Play, title: "Schedule a Demo", desc: "See the agent live with your actual data and business context." },
              { step: "03", icon: Zap, title: "We Deploy It", desc: "Our engineers integrate and configure everything in 1–5 days." },
              { step: "04", icon: TrendingUp, title: "Watch ROI Grow", desc: "Track results in real-time. Most clients see ROI within 30 days." },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center relative">
                <div className="text-6xl font-black text-gray-100 mb-4 leading-none">{s.step}</div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 -mt-6">
                  <s.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, title: "30-Day Guarantee", desc: "Full refund if no ROI in 30 days" },
              { icon: Users, title: "Dedicated Support", desc: "Slack channel + weekly check-ins" },
              { icon: Zap, title: "Fast Deployment", desc: "Live in 1–5 business days" },
              { icon: BarChart3, title: "Proven Results", desc: "$10M+ ROI delivered to clients" },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
                  <t.icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{t.title}</p>
                <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "Do I need technical skills to deploy an AI agent?", a: "No. Our team handles the entire setup, integration, and configuration. You'll be live in 1–5 business days with zero code required." },
              { q: "What if I don't see ROI?", a: "We offer a 30-day money-back guarantee. If you don't see measurable results in the first 30 days, we'll refund you — no questions asked." },
              { q: "Can I customize the AI agent for my business?", a: "Yes. Every agent is trained on your data, connected to your tools, and configured to match your specific workflows and brand voice." },
              { q: "How do the integrations work?", a: "We connect directly to your existing tools (CRM, email, Slack, etc.) using APIs and webhooks. No data migration needed." },
              { q: "Is my data secure?", a: "Yes. We're SOC 2 Type II certified and GDPR compliant. Your data is encrypted in transit and at rest, and never used to train other clients' models." },
              { q: "Can I cancel anytime?", a: "Yes. All plans are month-to-month with no long-term contracts. Cancel anytime from your dashboard." },
            ].map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── Final CTA / Waitlist ── */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {waitlistDone ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">You're on the list! 🎉</h2>
              <p className="text-xl text-blue-100">Expect an email with exclusive early access and founding member pricing within 24 hours.</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/25 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Crown className="w-4 h-4 text-yellow-300" /> Limited to 100 Founding Members
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to deploy your first AI agent?</h2>
              <p className="text-xl text-blue-100 mb-8">Join 500+ businesses using Advanta AI to automate, scale, and grow.</p>
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)} placeholder="Your work email"
                  required className="flex-1 px-5 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white text-sm" />
                <button type="submit" disabled={waitlistLoading}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-2xl font-bold transition-all hover:scale-105 disabled:opacity-70 whitespace-nowrap flex items-center gap-2 justify-center">
                  {waitlistLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" />Get Early Access</>}
                </button>
              </form>
              <p className="text-xs text-blue-200 mt-4">No spam · Unsubscribe anytime · Founding member pricing locked in</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />

      {/* ── Modals ── */}
      <AnimatePresence>
        {selectedAgent && (
          <AgentPanel
            agent={selectedAgent}
            onClose={() => setSelectedAgent(null)}
            onDemo={() => { setDemoAgent(selectedAgent); setSelectedAgent(null); }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {demoAgent && <DemoModal agent={demoAgent} onClose={() => setDemoAgent(null)} />}
      </AnimatePresence>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
