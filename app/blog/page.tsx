import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — AI Automation Guides & Business AI Insights | Advanta AI",
  description:
    "Practical guides on AI automation, business growth, and real-world workflow deployment. Written by Davide Demango, founder of Advanta AI.",
  alternates: { canonical: "https://advanta-ai.com/blog" },
};

const posts = [
  {
    slug: "how-to-automate-your-business-with-ai",
    title: "How to Automate Your Business With AI in 2025: A Practical Guide",
    excerpt:
      "Most businesses waste 30–40% of their team's time on tasks AI could handle in seconds. Here's exactly how to identify those tasks, pick the right tools, and deploy your first automation this week.",
    category: "Getting Started",
    readTime: "8 min read",
    author: "Davide Demango",
  },
  {
    slug: "ai-tools-for-small-business-2025",
    title: "The Best AI Tools for Small Businesses in 2025",
    excerpt:
      "Not every AI tool is built for small businesses. This curated list covers customer support, marketing, sales, and operations — every tool practical, affordable, and genuinely useful.",
    category: "Tools & Resources",
    readTime: "10 min read",
    author: "Davide Demango",
  },
  {
    slug: "ai-automation-roi-guide",
    title: "How to Measure the ROI of AI Automation for Your Business",
    excerpt:
      "Most AI projects fail not because the tech didn't work, but because nobody could prove it worked. Here's the framework we use to measure and communicate the real business value of automation.",
    category: "Strategy",
    readTime: "7 min read",
    author: "Davide Demango",
  },
];

const comingSoon = [
  { title: "How We Built a Customer Support Bot That Resolves 80% of Tickets", category: "Customer Support" },
  { title: "5 Workflows Every E-Commerce Store Should Have Running", category: "E-Commerce" },
  { title: "From Zero to First Automation: A Beginner's Guide", category: "Getting Started" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI Insights &amp; Automation Guides
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Practical guides on AI automation, business growth, and real-world workflow deployment.
              Written by <strong>Davide Demango</strong>, founder of Advanta AI.
            </p>
          </div>

          {/* Published posts */}
          <div className="space-y-8 mb-16">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      {post.category}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 flex-shrink-0 mt-2 transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          {/* Coming soon */}
          <div className="mb-16">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Coming Soon</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {comingSoon.map((post) => (
                <div key={post.title} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="font-semibold text-gray-700 mt-2 leading-snug text-sm">{post.title}</h3>
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full mt-3 inline-block">Coming Soon</span>
                </div>
              ))}
            </div>
          </div>

          {/* Free tools CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-violet-700 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              While You&apos;re Here — Try Our Free AI Tools
            </h2>
            <p className="text-blue-100 mb-6">
              30+ tools to automate your business. No sign-up required.
            </p>
            <Link
              href="/free-tools"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Free Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
