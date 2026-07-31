import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Automate Your Business With AI in 2025 — A Practical Guide",
  description:
    "A step-by-step guide to automating your business using AI tools in 2025. Learn which workflows to automate first, which tools to use, and how to get ROI within 30 days.",
  alternates: { canonical: "https://advanta-ai.com/blog/how-to-automate-your-business-with-ai" },
  openGraph: {
    title: "How to Automate Your Business With AI in 2025",
    description:
      "Step-by-step guide to AI business automation. Which workflows to start with, which tools to use, and how to see ROI within 30 days.",
    url: "https://advanta-ai.com/blog/how-to-automate-your-business-with-ai",
    type: "article",
  },
};

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Getting Started
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
              How to Automate Your Business With AI in 2025: A Practical Guide
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Most businesses waste 30–40% of their team&apos;s time on repetitive tasks that AI
              could handle in seconds. Here&apos;s exactly how to identify those tasks, pick the
              right tools, and deploy your first automation this week.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
              <span>By <strong className="text-gray-700">Davide Demango</strong>, Founder &amp; CEO of Advanta AI</span>
              <span>·</span>
              <span>8 min read</span>
            </div>
          </header>

          {/* Body */}
          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Why Most Businesses Are Still Doing Things Manually</h2>
            <p>
              In 2025, there&apos;s no shortage of AI tools. There&apos;s a shortage of clarity. Most business
              owners know they should be using AI — they just don&apos;t know where to start, or they
              tried something once and it didn&apos;t stick.
            </p>
            <p>
              The problem isn&apos;t the technology. It&apos;s the approach. Most people try to automate
              the wrong things first, or they reach for the most complex tool instead of the
              most effective one. This guide fixes that.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">Step 1: Audit Your Time — Find the 20% Killing Your Productivity</h2>
            <p>
              Before you pick a single tool, spend one week tracking where your team&apos;s time goes.
              Look specifically for tasks that are:
            </p>
            <ul className="space-y-2">
              {[
                "Repeated more than 5 times per week",
                "Rule-based (if X, then Y) with no real decision-making",
                "Data entry, copy-pasting, or reformatting information",
                "Sending the same type of email or message repeatedly",
                "Generating reports from existing data",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              These are your automation targets. For most businesses, the biggest wins come from
              customer communication (follow-ups, support replies), lead qualification, appointment
              scheduling, and internal reporting.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">Step 2: Start With the Highest-ROI Workflow</h2>
            <p>
              Not all automations are equal. The highest-ROI workflows are the ones that either
              directly touch revenue (lead response, sales follow-up) or free up your most
              expensive employees (operations managers, senior sales reps).
            </p>
            <p>
              At Advanta AI, we typically recommend starting with <strong>automated lead response</strong>.
              Studies consistently show that responding to a lead within 5 minutes increases
              conversion by 9x. An AI can handle that response instantly, qualify the lead with
              a few questions, and book a call — all without human involvement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">Step 3: Choose the Right Tools</h2>
            <p>
              You don&apos;t need to build anything from scratch. In 2025, the right stack for most
              small and mid-sized businesses looks like this:
            </p>
            <div className="bg-blue-50 rounded-2xl p-6 space-y-4 not-prose">
              {[
                { tool: "ChatGPT / Claude", use: "Drafting content, summarizing info, customer-facing copy" },
                { tool: "Zapier / Make", use: "Connecting your apps and triggering workflows automatically" },
                { tool: "Custom AI Assistants", use: "24/7 customer chat, lead qualification, support ticketing" },
                { tool: "AI Email Tools", use: "Automated follow-up sequences, response drafting" },
              ].map((row) => (
                <div key={row.tool} className="flex gap-4">
                  <div className="font-bold text-gray-900 min-w-[180px]">{row.tool}</div>
                  <div className="text-gray-600 text-sm">{row.use}</div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Step 4: Deploy, Measure, Iterate</h2>
            <p>
              Your first automation doesn&apos;t need to be perfect — it needs to run. Deploy it,
              measure the output for two weeks, and then optimize. Track:
            </p>
            <ul className="space-y-2">
              {[
                "Time saved per week (hours)",
                "Error rate compared to manual process",
                "Revenue or leads touched by the automation",
                "Team satisfaction (are they actually using it?)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-gray-900">The 30-Day Automation Plan</h2>
            <p>
              Week 1: Audit and identify your top 3 automation targets.<br />
              Week 2: Deploy one automation — pick the simplest, highest-impact target.<br />
              Week 3: Measure, fix issues, and document the process.<br />
              Week 4: Scale it and identify target #2.
            </p>
            <p>
              By the end of 30 days, you&apos;ll have a working automation, a clear measurement
              framework, and the confidence to move faster. Most of our clients see their first
              real ROI in week two.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">Final Thoughts</h2>
            <p>
              AI automation isn&apos;t about replacing your team — it&apos;s about freeing them to do the
              work that actually requires a human. The businesses that win in the next five years
              won&apos;t be the ones with the most employees. They&apos;ll be the ones who figured out
              how to make a small team operate like a much larger one.
            </p>
            <p>
              Start with one workflow. Measure it. Then build from there.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Automate Your First Workflow?
            </h3>
            <p className="text-blue-100 mb-6">
              Use our free AI Stack Builder to find the right tools for your business in under 2 minutes.
            </p>
            <Link
              href="/ai-stack-builder"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Build My AI Stack <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* More posts */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">More from the blog</p>
            <div className="space-y-3">
              <Link href="/blog/ai-tools-for-small-business-2025" className="block text-blue-600 hover:text-blue-700 font-medium">
                → The Best AI Tools for Small Businesses in 2025
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
