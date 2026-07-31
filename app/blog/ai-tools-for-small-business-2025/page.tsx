import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Best AI Tools for Small Businesses in 2025",
  description:
    "A curated list of the best AI tools for small businesses in 2025 — covering marketing, customer support, sales, operations, and content creation. All tested, all practical.",
  alternates: { canonical: "https://advanta-ai.com/blog/ai-tools-for-small-business-2025" },
  openGraph: {
    title: "The Best AI Tools for Small Businesses in 2025",
    description:
      "Curated, practical AI tools for small businesses — marketing, support, sales, and operations. All tested and ranked by ROI.",
    url: "https://advanta-ai.com/blog/ai-tools-for-small-business-2025",
    type: "article",
  },
};

const tools = [
  {
    category: "Customer Support",
    items: [
      { name: "Custom AI Chat Assistant", description: "A trained chatbot that answers FAQs, qualifies leads, and books calls 24/7. At Advanta AI, we build these for clients in days — they typically resolve 60–80% of support tickets without human involvement." },
      { name: "ChatGPT for Support Drafts", description: "Use ChatGPT to draft email responses to complex support tickets. Your team reviews and sends. Cuts response time by 70%." },
    ],
  },
  {
    category: "Marketing & Content",
    items: [
      { name: "AI Marketing Copy Generator", description: "Generate ad copy, social posts, and product descriptions in seconds. Our free Marketing Copy Generator at Advanta AI is purpose-built for this." },
      { name: "Content Calendar Generator", description: "Plan a month of content in 10 minutes. Enter your niche and audience; the AI outputs a full content calendar with topics, angles, and posting days." },
      { name: "LinkedIn Post Generator", description: "For founders and solo operators who want to build a personal brand. Input a topic or idea; get a polished, on-brand LinkedIn post." },
    ],
  },
  {
    category: "Sales",
    items: [
      { name: "Cold Email Generator", description: "Write cold outreach that doesn't sound like a template. The AI personalizes each email based on the prospect's industry, role, and pain points." },
      { name: "Lead Magnet Builder", description: "Create high-converting lead magnets — checklists, guides, mini-courses — in under an hour. Upload to your site and let them work 24/7." },
    ],
  },
  {
    category: "Operations",
    items: [
      { name: "Zapier + AI", description: "Connect your apps and build automated workflows without code. When a lead fills out a form, Zapier can send them an AI-written welcome email, add them to your CRM, and notify your sales team — all automatically." },
      { name: "AI Resume & Hiring Tools", description: "Screen job applicants faster. AI reads resumes, scores them against your criteria, and surfaces the top candidates — saving hours per hire." },
    ],
  },
];

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <header className="mb-12">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Tools &amp; Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
              The Best AI Tools for Small Businesses in 2025
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Not every AI tool is built for small businesses. Many are expensive, complex, or
              designed for enterprises with dedicated IT teams. This list cuts through the noise
              — every tool here is practical, affordable, and genuinely useful.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
              <span>By <strong className="text-gray-700">Davide Demango</strong>, Founder &amp; CEO of Advanta AI</span>
              <span>·</span>
              <span>10 min read</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            <p>
              Small businesses have a unique advantage when it comes to AI: they can move faster
              than large organizations. No procurement process. No IT committee. No six-month
              rollout plan. You can try a tool today and be saving hours by tomorrow.
            </p>
            <p>
              The challenge is knowing which tools are worth your time. Here&apos;s the honest breakdown
              by category — based on what Advanta AI has deployed for hundreds of small businesses.
            </p>

            {tools.map((section) => (
              <div key={section.category}>
                <h2 className="text-2xl font-bold text-gray-900">{section.category}</h2>
                <div className="space-y-6 not-prose">
                  {section.items.map((tool) => (
                    <div key={tool.name} className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-2">{tool.name}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <h2 className="text-2xl font-bold text-gray-900">How to Pick Your Starting Point</h2>
            <p>
              The best tool is the one you&apos;ll actually use. Don&apos;t try to implement everything
              at once. Pick the category that has the most direct impact on revenue or that&apos;s
              currently eating the most of your team&apos;s time — then go deep on that one before
              adding more.
            </p>
            <p>
              For most small businesses, the fastest wins come from customer-facing automation:
              a chat assistant that answers questions and qualifies leads, or an email sequence
              that follows up with prospects automatically. These tools pay for themselves
              within weeks, not months.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">The Free Tools at Advanta AI</h2>
            <p>
              Advanta AI offers 30+ free AI tools purpose-built for small businesses — from a
              cold email generator to a business idea validator to an AI stack builder that
              recommends the right tool stack for your specific business. All free. No credit
              card required.
            </p>
          </div>

          <div className="mt-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Try Our Free AI Tools — No Sign-Up Required
            </h3>
            <p className="text-blue-100 mb-6">
              30+ tools built specifically for small businesses. Use them free, forever.
            </p>
            <Link
              href="/free-tools"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Free Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">More from the blog</p>
            <div className="space-y-3">
              <Link href="/blog/how-to-automate-your-business-with-ai" className="block text-blue-600 hover:text-blue-700 font-medium">
                → How to Automate Your Business With AI in 2025
              </Link>
              <Link href="/blog/ai-automation-roi-guide" className="block text-blue-600 hover:text-blue-700 font-medium">
                → How to Measure the ROI of AI Automation
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
