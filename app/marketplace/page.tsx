"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Bot, Zap, BarChart3, Mail, Users, Shield, Star, Crown, ArrowRight,
  CheckCircle, Search, Filter, TrendingUp, Brain, Headphones, ShoppingCart,
  FileText, Globe, Lock,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: any;
  category: string;
  price: string;
  priceNote: string;
  rating: number;
  reviews: number;
  tags: string[];
  features: string[];
  color: string;
  popular?: boolean;
  new?: boolean;
}

const agents: Agent[] = [
  {
    id: "sales-ai",
    name: "Sales AI Agent",
    description: "Automate lead qualification, follow-ups, and CRM updates 24/7.",
    longDescription: "A fully autonomous sales agent that qualifies leads, sends personalized follow-up sequences, updates your CRM, and books meetings—all without human intervention.",
    icon: TrendingUp,
    category: "Sales",
    price: "$297",
    priceNote: "/month",
    rating: 4.9,
    reviews: 128,
    tags: ["Lead Gen", "CRM", "Email"],
    features: ["Automated lead scoring", "Personalized email sequences", "CRM sync (HubSpot, Salesforce)", "Meeting scheduling", "Real-time reporting"],
    color: "blue",
    popular: true,
  },
  {
    id: "support-ai",
    name: "Customer Support AI",
    description: "Handle 80% of support tickets instantly with human-like responses.",
    longDescription: "Deploy an always-on support agent that understands your products, handles FAQs, escalates complex issues, and learns from every interaction.",
    icon: Headphones,
    category: "Support",
    price: "$197",
    priceNote: "/month",
    rating: 4.8,
    reviews: 95,
    tags: ["Helpdesk", "Chatbot", "Tickets"],
    features: ["Multi-channel support", "Custom knowledge base", "Ticket routing", "Sentiment analysis", "Escalation rules"],
    color: "green",
  },
  {
    id: "marketing-ai",
    name: "Marketing Automation AI",
    description: "Create, schedule, and optimize content campaigns automatically.",
    longDescription: "An intelligent marketing agent that generates copy, schedules posts across platforms, A/B tests campaigns, and optimizes ad spend in real-time.",
    icon: BarChart3,
    category: "Marketing",
    price: "$247",
    priceNote: "/month",
    rating: 4.7,
    reviews: 82,
    tags: ["Content", "Social", "Ads"],
    features: ["AI content generation", "Multi-platform posting", "A/B testing", "Performance analytics", "Ad optimization"],
    color: "purple",
    new: true,
  },
  {
    id: "ops-ai",
    name: "Operations Workflow AI",
    description: "Automate internal processes, approvals, and data pipelines.",
    longDescription: "Streamline operations with an AI agent that handles approvals, data extraction, document processing, and cross-system integrations automatically.",
    icon: Zap,
    category: "Operations",
    price: "$347",
    priceNote: "/month",
    rating: 4.9,
    reviews: 61,
    tags: ["Automation", "Workflows", "Integration"],
    features: ["Document processing", "Approval workflows", "Data extraction", "API integrations", "Error handling"],
    color: "orange",
  },
  {
    id: "analytics-ai",
    name: "Business Analytics AI",
    description: "Turn your data into actionable insights with natural language queries.",
    longDescription: "Ask questions about your business data in plain English and get instant, accurate insights with charts, trends, and recommendations.",
    icon: Brain,
    category: "Analytics",
    price: "$197",
    priceNote: "/month",
    rating: 4.6,
    reviews: 74,
    tags: ["Data", "Reporting", "BI"],
    features: ["Natural language queries", "Auto-generated reports", "Anomaly detection", "Predictive analytics", "Dashboard builder"],
    color: "indigo",
  },
  {
    id: "hr-ai",
    name: "HR & Recruiting AI",
    description: "Screen candidates, schedule interviews, and onboard employees automatically.",
    longDescription: "An end-to-end HR automation agent that screens resumes, scores candidates, schedules interviews, and sends onboarding sequences on autopilot.",
    icon: Users,
    category: "HR",
    price: "$227",
    priceNote: "/month",
    rating: 4.7,
    reviews: 53,
    tags: ["Recruiting", "Onboarding", "HR"],
    features: ["Resume screening", "Candidate scoring", "Interview scheduling", "Onboarding workflows", "Compliance checks"],
    color: "pink",
  },
  {
    id: "ecommerce-ai",
    name: "E-Commerce AI Agent",
    description: "Boost conversions with AI-powered product recommendations and cart recovery.",
    longDescription: "Drive more revenue with personalized product recommendations, automated cart abandonment recovery, dynamic pricing, and customer segmentation.",
    icon: ShoppingCart,
    category: "E-Commerce",
    price: "$297",
    priceNote: "/month",
    rating: 4.8,
    reviews: 89,
    tags: ["Shopify", "WooCommerce", "Revenue"],
    features: ["Product recommendations", "Cart recovery", "Dynamic pricing", "Customer segmentation", "Inventory alerts"],
    color: "teal",
    popular: true,
  },
  {
    id: "content-ai",
    name: "Content Creation AI",
    description: "Generate blog posts, social content, and copy at scale.",
    longDescription: "A powerful content engine that generates SEO-optimized blog posts, social media content, email newsletters, and ad copy—all on-brand and on-schedule.",
    icon: FileText,
    category: "Content",
    price: "$147",
    priceNote: "/month",
    rating: 4.5,
    reviews: 107,
    tags: ["Blog", "SEO", "Copywriting"],
    features: ["SEO-optimized posts", "Brand voice matching", "Multi-platform formatting", "Image prompts", "Content calendar"],
    color: "yellow",
  },
  {
    id: "website-ai",
    name: "Website AI Assistant",
    description: "Embed a smart AI assistant on your website that converts visitors.",
    longDescription: "Add a fully customized AI assistant to your website that answers questions, qualifies leads, books demos, and provides 24/7 customer support.",
    icon: Globe,
    category: "Website",
    price: "$97",
    priceNote: "/month",
    rating: 4.8,
    reviews: 143,
    tags: ["Chatbot", "Conversion", "Website"],
    features: ["Easy embed (1 line of code)", "Custom training", "Lead capture", "CRM integration", "Analytics dashboard"],
    color: "cyan",
    popular: true,
  },
];

const categories = ["All", ...Array.from(new Set(agents.map((a) => a.category)))];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
};

function AgentCard({ agent }: { agent: Agent }) {
  const [expanded, setExpanded] = useState(false);
  const c = colorMap[agent.color] || colorMap.blue;

  return (
    <motion.div
      layout
      className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${c.border} hover:border-opacity-100`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center`}>
            <agent.icon className={`w-6 h-6 ${c.text}`} />
          </div>
          <div className="flex gap-2">
            {agent.popular && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <Crown className="w-3 h-3" /> Popular
              </span>
            )}
            {agent.new && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">New</span>
            )}
          </div>
        </div>

        <div className="mb-1">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{agent.category}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{agent.name}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{agent.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {agent.tags.map((tag) => (
            <span key={tag} className={`text-xs px-2 py-1 rounded-full ${c.bg} ${c.text} font-medium`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(agent.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">{agent.rating} ({agent.reviews})</span>
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4"
          >
            <p className="text-sm text-gray-600 mb-3">{agent.longDescription}</p>
            <ul className="space-y-1.5">
              {agent.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">{agent.price}</span>
            <span className="text-sm text-gray-500">{agent.priceNote}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {expanded ? "Less" : "Details"}
            </button>
            <Link
              href="/contact"
              className={`text-sm text-white px-4 py-1.5 rounded-lg transition-all hover:scale-105 font-medium ${c.text.replace("text-", "bg-").replace("-600", "-600")} bg-blue-600 hover:bg-blue-700`}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filtered = agents
    .filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      const matchCat = category === "All" || a.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === "popular") return b.reviews - a.reviews;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "price-low") return parseInt(a.price.replace("$", "")) - parseInt(b.price.replace("$", ""));
      if (sort === "price-high") return parseInt(b.price.replace("$", "")) - parseInt(a.price.replace("$", ""));
      return 0;
    });

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch("/api/waitlist/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Crown className="w-4 h-4" />
              Premium AI Solutions Marketplace
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              The AI Marketplace for{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ambitious Businesses
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Ready-to-deploy AI agents for sales, marketing, support, and operations.
              Each solution delivers measurable ROI from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#agents" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105">
                Browse AI Agents <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#waitlist" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all">
                Get Early Access
              </a>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="relative max-w-4xl mx-auto px-4 mt-16">
          <div className="grid grid-cols-3 gap-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            {[
              { v: "9", l: "AI Agent Categories" },
              { v: "$10M+", l: "ROI Delivered" },
              { v: "500+", l: "Businesses Served" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-sm text-gray-300">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section id="agents" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search AI agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How the Marketplace Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose an AI Agent", desc: "Browse our catalog of battle-tested AI agents. Filter by category, rating, or use case.", icon: Search },
              { step: "02", title: "Deploy in Days", desc: "Our team integrates the AI agent with your existing tools and systems in 3-5 business days.", icon: Zap },
              { step: "03", title: "Watch ROI Grow", desc: "Monitor performance from your dashboard. Most clients see measurable ROI within 30 days.", icon: TrendingUp },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-black text-blue-100 mb-4">{s.step}</div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Waitlist */}
      <section id="waitlist" className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">You're In! 🎉</h2>
              <p className="text-xl text-blue-100">
                You'll be among the first to access exclusive AI agent deals and founding member pricing.
              </p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Lock className="w-4 h-4" /> Exclusive Early Access
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Get Priority Access + Founding Member Pricing
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join 500+ businesses on the exclusive waitlist. Limited to 100 founding members.
              </p>
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-70 whitespace-nowrap"
                >
                  {submitting ? "Joining..." : "Get Early Access"}
                </button>
              </form>
              <p className="text-xs text-blue-200 mt-4">No spam. Unsubscribe anytime.</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
