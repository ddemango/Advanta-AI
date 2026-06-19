"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useState } from "react";
import { Zap } from "lucide-react";

const comingSoonPosts = [
  { title: "How to Automate Your Lead Nurture Sequence in 48 Hours", category: "Marketing", eta: "Coming Soon" },
  { title: "The Complete Guide to AI Stack Building for SMBs", category: "Strategy", eta: "Coming Soon" },
  { title: "5 Workflows Every E-Commerce Store Should Have Running", category: "E-Commerce", eta: "Coming Soon" },
  { title: "How We Built a Customer Support Bot That Resolves 80% of Tickets", category: "Customer Support", eta: "Coming Soon" },
  { title: "Pricing Your Services in 2026: What AI Says vs. What Actually Works", category: "Finance", eta: "Coming Soon" },
  { title: "From Zero to First Automation: A Beginner's Guide", category: "Getting Started", eta: "Coming Soon" },
];

export default function BlogPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" /> Blog launching soon
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI Insights & Automation Guides
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Practical guides on AI automation, business growth, and real-world workflow deployment. Written by practitioners, not marketers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {comingSoonPosts.map((post, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-blue-200 transition-colors">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{post.category}</span>
                <h2 className="font-bold text-gray-900 mt-2 mb-3 leading-snug">{post.title}</h2>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{post.eta}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-violet-700 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Get Notified When We Publish</h2>
            <p className="text-blue-100 mb-6">Practical AI guides, delivered to your inbox. No fluff.</p>
            {subscribed ? (
              <p className="text-green-300 font-semibold">✓ You're on the list!</p>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}>
                <input type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none" />
                <button type="submit" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex-shrink-0">
                  Notify Me
                </button>
              </form>
            )}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">While you wait, try our free AI tools:</p>
            <Link href="/free-tools" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              <Zap className="w-4 h-4" /> Explore Free Tools
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
