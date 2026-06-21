"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Zap, Brain, BarChart3, Search, Mail, FileText, TrendingUp,
  Mic, Bot, BookOpen, Calendar,
  DollarSign, Target, Building2, Eye, Lightbulb, Linkedin,
  Youtube, HelpCircle, User, ShoppingBag,
  Film, Dumbbell, Globe, Plane, MapPin,
  Grid3X3, List, Star, CheckCircle, X,
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  href: string;
  featured?: boolean;
  badge?: string;
}

const tools: Tool[] = [
  { id: "marketing-report", name: "Marketing Report Generator", description: "Generate comprehensive marketing reports with AI-driven insights, KPI analysis, and actionable recommendations.", icon: BarChart3, category: "Marketing", href: "/tools/marketing-report", featured: true, badge: "Popular" },
  { id: "swot-analysis", name: "SWOT Analysis Generator", description: "Create detailed SWOT analyses to identify strengths, weaknesses, opportunities, and threats for strategic planning.", icon: Target, category: "Business Strategy", href: "/tools/swot-analysis", featured: true },
  { id: "sop-builder", name: "SOP Builder", description: "Build comprehensive Standard Operating Procedures with step-by-step instructions and tool requirements.", icon: FileText, category: "Business Strategy", href: "/tools/sop-builder", featured: true },
  { id: "competitor-lite", name: "Competitor Intel Scanner", description: "Analyze competitor websites for technology stack, performance metrics, and strategic insights.", icon: Search, category: "Market Research", href: "/tools/competitor-lite", featured: true, badge: "New" },
  { id: "rfp-response", name: "RFP Response Builder", description: "Generate professional RFP responses with structured outlines, timelines, and risk assessments.", icon: CheckCircle, category: "Business Strategy", href: "/tools/rfp-response-builder", featured: true },
  { id: "ai-stack-builder", name: "AI Stack Builder", description: "Answer 4 questions and get a personalized AI tool recommendation with ROI estimates and quick wins.", icon: Zap, category: "Business Strategy", href: "/ai-stack-builder", featured: true, badge: "Popular" },
  { id: "trending-content", name: "Trending Content Generator", description: "Generate viral content based on real-time trend analysis across all platforms.", icon: TrendingUp, category: "Content Creation", href: "/trending-content-generator", featured: true },
  { id: "cold-email", name: "Cold Email Generator", description: "Create personalized cold email campaigns that convert prospects into customers.", icon: Mail, category: "Sales & Marketing", href: "/cold-email-generator" },
  { id: "resume-generator", name: "Resume Generator", description: "Build professional resumes optimized for ATS systems and specific job roles.", icon: FileText, category: "Career Tools", href: "/resume-generator" },
  { id: "ats-resume-tailor", name: "ATS Resume Tailor", description: "Optimize your resume for ATS systems with AI-powered tailoring and keyword matching.", icon: Target, category: "Career Tools", href: "/ats-resume-tailor", featured: true },
  { id: "voiceover-script", name: "AI Voiceover Script Generator", description: "Generate engaging voiceover scripts for videos, podcasts, and presentations.", icon: Mic, category: "Content Creation", href: "/voiceover-script-generator" },
  { id: "custom-gpt", name: "Custom GPT Bot Generator", description: "Create custom AI chatbots tailored to your specific business requirements.", icon: Bot, category: "AI Development", href: "/custom-gpt-generator" },
  { id: "prompt-library", name: "Time-Saving Prompt Library", description: "Access a curated collection of proven prompts for various AI tools and use cases.", icon: BookOpen, category: "Resources", href: "/prompt-library" },
  { id: "content-calendar", name: "Content Calendar Generator", description: "Plan and schedule your content strategy with AI-generated calendar templates.", icon: Calendar, category: "Content Planning", href: "/content-calendar-generator" },
  { id: "pricing-strategy", name: "Pricing Strategy Assistant", description: "Optimize your pricing strategy with AI-driven market analysis and recommendations.", icon: DollarSign, category: "Business Strategy", href: "/pricing-strategy-assistant" },
  { id: "brand-kit", name: "Brand Kit Generator", description: "Create complete brand identity packages with logos, colors, and style guides.", icon: Target, category: "Branding", href: "/brand-kit-generator" },
  { id: "marketing-copy", name: "Marketing Copy Generator", description: "Generate compelling marketing copy for ads, emails, and website content.", icon: Building2, category: "Copywriting", href: "/marketing-copy-generator" },
  { id: "headline-split", name: "Headline Split-Test Generator", description: "Create multiple headline variations for A/B testing and optimization.", icon: Eye, category: "Testing & Optimization", href: "/headline-split-test-generator" },
  { id: "business-idea", name: "Business Idea Validator", description: "Validate your business ideas with market research and feasibility analysis.", icon: Lightbulb, category: "Business Strategy", href: "/business-idea-validator" },
  { id: "linkedin-post", name: "LinkedIn Post Generator", description: "Generate 3 viral LinkedIn post variations with hooks, hashtags, and engagement analysis.", icon: Linkedin, category: "Social Media", href: "/linkedin-post-generator", featured: true, badge: "New" },
  { id: "cover-letter", name: "Cover Letter Generator", description: "AI-crafted cover letters tailored to the job, company, and your experience.", icon: FileText, category: "Career Tools", href: "/cover-letter-generator", badge: "New" },
  { id: "youtube-desc", name: "YouTube Description Generator", description: "SEO-optimized YouTube descriptions, tags, chapter markers, and thumbnail ideas.", icon: Youtube, category: "Content Creation", href: "/youtube-description-generator", badge: "New" },
  { id: "faq-generator", name: "FAQ Generator", description: "Generate SEO-optimized FAQ sections with Google-ready schema markup included.", icon: HelpCircle, category: "SEO & Content", href: "/faq-generator", featured: true, badge: "New" },
  { id: "bio-generator", name: "Bio Generator", description: "Professional bios for LinkedIn, Twitter, your website, and speaker profiles.", icon: User, category: "Personal Branding", href: "/bio-generator", badge: "New" },
  { id: "product-desc", name: "Product Description Generator", description: "High-converting product descriptions, bullet points, and SEO copy for any platform.", icon: ShoppingBag, category: "E-Commerce", href: "/product-description-generator", badge: "New" },
  { id: "movie-matchmaker", name: "Movie & TV Matchmaker", description: "Get personalized movie and TV show picks based on your mood, taste, and streaming services.", icon: Film, category: "Lifestyle", href: "/movie-tv-matchmaker", featured: true, badge: "New" },
  { id: "workout-planner", name: "AI Workout Planner", description: "Get a personalized weekly workout plan based on your goal, fitness level, and equipment.", icon: Dumbbell, category: "Lifestyle", href: "/workout-planner", badge: "New" },
  { id: "best-time-to-travel", name: "Best Time to Travel", description: "Month-by-month guide with weather, crowds, prices, and events for any destination.", icon: Globe, category: "Travel", href: "/best-time-to-travel", featured: true, badge: "New" },
  { id: "best-time-to-book", name: "Best Time to Book Flights & Hotels", description: "Know exactly when to book to get the lowest prices — flights, hotels, and booking strategies.", icon: Plane, category: "Travel", href: "/best-time-to-book", badge: "New" },
  { id: "travel-deal-finder", name: "Travel Deal Finder", description: "Find the best bang-for-your-buck destinations based on your budget, interests, and travel style.", icon: MapPin, category: "Travel", href: "/travel-deal-finder", featured: true, badge: "New" },
];

const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];
const quickAccess = tools.filter((t) => t.featured).slice(0, 6);

export default function FreeToolsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = tools.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    const matchCat = category === "All" || t.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              {tools.length}+ Free AI Tools
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Professional AI Tools —{" "}
              <span className="text-blue-600">Completely Free</span>
            </h1>
            <p className="text-xl text-gray-600">
              No credit card required. No limits. Just powerful AI at your fingertips.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">Quick Access — Most Popular</h2>
            </div>
            <button onClick={() => setCategory("All")} className="text-sm text-blue-600 hover:underline">
              View all →
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickAccess.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <tool.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                    {tool.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{tool.category}</div>
                </div>
                {tool.badge && (
                  <span className="ml-auto flex-shrink-0 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                    {tool.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search + Filter + Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools by name, description, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-3 rounded-xl border transition-colors ${view === "grid" ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-3 rounded-xl border transition-colors ${view === "list" ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No tools found</h3>
              <p className="text-gray-400">Try a different search or category.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tool, i) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={tool.href}
                    className="block h-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <tool.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tool.category}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{tool.description}</p>
                    <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium">
                      Launch Tool →
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((tool, i) => (
                <motion.div key={tool.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link
                    href={tool.href}
                    className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                      <tool.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{tool.name}</div>
                      <div className="text-sm text-gray-500 truncate">{tool.description}</div>
                    </div>
                    <span className="flex-shrink-0 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tool.category}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start with our free tools and unlock the full power of AI automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai-stack-builder" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg">
              <Zap className="w-5 h-5" /> Build My AI Stack Free
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all">
              Get Custom AI Solutions
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
