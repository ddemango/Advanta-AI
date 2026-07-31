import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Measure the ROI of AI Automation for Your Business",
  description:
    "Learn exactly how to calculate the ROI of AI automation in your business. Includes a simple formula, real numbers, and a framework for justifying your next AI investment.",
  alternates: { canonical: "https://advanta-ai.com/blog/ai-automation-roi-guide" },
  openGraph: {
    title: "How to Measure the ROI of AI Automation for Your Business",
    description:
      "Simple formula and real numbers for measuring AI automation ROI. Know what to track, how to calculate it, and how to make the business case.",
    url: "https://advanta-ai.com/blog/ai-automation-roi-guide",
    type: "article",
  },
};

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
              Strategy
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
              How to Measure the ROI of AI Automation for Your Business
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Most AI projects fail not because the technology didn&apos;t work, but because nobody
              could prove it worked. Here&apos;s the framework we use at Advanta AI to measure,
              track, and communicate the real business value of automation.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
              <span>By <strong className="text-gray-700">Davide Demango</strong>, Founder &amp; CEO of Advanta AI</span>
              <span>·</span>
              <span>7 min read</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Why ROI Is Harder to Measure Than It Looks</h2>
            <p>
              AI automation creates value in two ways: it reduces costs and it creates new
              capacity. Both matter, but they show up differently on a spreadsheet — and most
              businesses only track one.
            </p>
            <p>
              The cost savings are obvious: fewer hours of manual work, lower headcount needs,
              fewer errors. The capacity gains are subtler but often worth more: when you free
              your team from data entry, they can do more sales calls. When you automate lead
              response, you capture deals you used to lose. That second category is where the
              real compounding value lives.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">The ROI Formula</h2>
            <div className="bg-blue-50 rounded-2xl p-6 not-prose">
              <p className="font-mono text-blue-800 font-bold text-lg">
                ROI = (Value Generated — Cost of Automation) ÷ Cost of Automation × 100
              </p>
              <p className="text-gray-600 text-sm mt-4">
                Where <strong>Value Generated</strong> = cost savings + revenue from newly captured opportunities.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Step 1: Calculate Your Baseline</h2>
            <p>
              Before you can measure improvement, you need a baseline. Track these numbers
              for the process you&apos;re automating:
            </p>
            <ul className="space-y-2 not-prose">
              {[
                "Hours per week spent on this task (across all team members)",
                "Fully-loaded cost per hour for those employees",
                "Current error rate or rework rate",
                "Revenue or leads touched by this process",
                "Time from trigger to completion (e.g. lead comes in → response sent)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-gray-900">Step 2: Measure After Deployment</h2>
            <p>
              After deploying your automation, track the same metrics. Give it at least two
              weeks before drawing conclusions — some workflows need time for the team to
              adjust behavior and for the AI to handle edge cases.
            </p>
            <p>
              The metrics that move fastest and most visibly are usually response time (if
              you&apos;re automating customer communication) and hours saved (if you&apos;re automating
              internal tasks). Track those first.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">A Real Example: Automated Lead Response</h2>
            <div className="bg-gray-50 rounded-2xl p-6 not-prose space-y-4">
              <div>
                <p className="font-bold text-gray-900 mb-1">Before automation</p>
                <p className="text-gray-600 text-sm">Average lead response time: 4 hours. Lead-to-meeting conversion rate: 12%. Sales rep time spent on initial outreach: 6 hours/week.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">After automation</p>
                <p className="text-gray-600 text-sm">Average lead response time: 90 seconds. Lead-to-meeting conversion rate: 24%. Sales rep time spent on initial outreach: 1 hour/week.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">ROI calculation</p>
                <p className="text-gray-600 text-sm">5 hours/week saved × $60/hr × 52 weeks = $15,600/yr in labor savings. Conversion rate doubled → 12 extra meetings/month → estimated $36,000 in additional annual revenue. Total value: ~$51,600. Cost of automation: $3,600/yr. ROI: 1,333%.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">What to Do When Results Are Hard to Quantify</h2>
            <p>
              Some automation benefits are real but hard to put a number on: team morale
              (less grunt work), reduced burnout, faster onboarding for new hires, better
              customer experience. Don&apos;t ignore these — document them qualitatively.
            </p>
            <p>
              A good way to capture qualitative ROI: survey your team before and after. Ask
              &quot;How much time per week do you spend on [task]?&quot; and &quot;How frustrating is this
              part of your job on a scale of 1–10?&quot; The before/after comparison tells a clear
              story even without hard dollars.
            </p>

            <h2 className="text-2xl font-bold text-gray-900">The Compounding Effect</h2>
            <p>
              Here&apos;s what most ROI analyses miss: automation compounds. When you free 5 hours
              a week for your team, they don&apos;t just &quot;save time&quot; — they fill that time with
              higher-value work. A sales rep who spends less time on admin does more outreach.
              A manager who spends less time on reporting has more time to coach their team.
            </p>
            <p>
              Track this downstream effect at the 90-day mark. You&apos;ll almost always find the
              real ROI is 2–3x what you calculated at week two.
            </p>
          </div>

          <div className="mt-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Calculate Your Automation ROI — Free
            </h3>
            <p className="text-blue-100 mb-6">
              Use our AI ROI Calculator to estimate the value of automating your top workflows.
            </p>
            <Link
              href="/roi-calculator"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Try the ROI Calculator <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">More from the blog</p>
            <div className="space-y-3">
              <Link href="/blog/how-to-automate-your-business-with-ai" className="block text-blue-600 hover:text-blue-700 font-medium">
                → How to Automate Your Business With AI in 2025
              </Link>
              <Link href="/blog/ai-tools-for-small-business-2025" className="block text-blue-600 hover:text-blue-700 font-medium">
                → The Best AI Tools for Small Businesses in 2025
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
