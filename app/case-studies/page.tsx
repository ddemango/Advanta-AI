import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";
import { TrendingUp, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies — Real AI Results | Advanta AI",
  description: "See how businesses use Advanta AI workflows to reduce costs, save time, and scale faster. Real numbers, real results.",
};

const stats = [
  { value: "500+", label: "Businesses using our workflows" },
  { value: "85%", label: "Average cost reduction" },
  { value: "2.5M+", label: "Tasks automated" },
  { value: "3.8x", label: "Average ROI" },
];

const teaser = [
  {
    company: "GrowthSaaS",
    industry: "SaaS",
    result: "+342% qualified leads in 60 days",
    workflow: "Outbound Prospecting Engine",
    quote: "Set it up in an afternoon. Booked 4 calls in the first week.",
    person: "Sarah M., Founder",
  },
  {
    company: "NorthShore DTC",
    industry: "E-Commerce",
    result: "+$12K/month in recovered revenue",
    workflow: "Abandoned Cart Recovery Engine",
    quote: "Added $12K/month in recovered revenue in the first 30 days.",
    person: "Emily W., Brand Owner",
  },
  {
    company: "TechCorp",
    industry: "B2B Sales",
    result: "95% reduction in CRM data entry",
    workflow: "CRM Auto-Update & Deal Tracker",
    quote: "Our reps stopped dreading CRM updates. Data is always current now.",
    person: "Mike R., VP Sales",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" /> Real Results
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Businesses Win With<br />Advanta AI Workflows
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real companies, real automations, real numbers. These aren't projections — they're what happens when the right workflow meets the right team.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-6 bg-blue-50 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">{s.value}</div>
                <div className="text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-6 mb-16">
            {teaser.map((c, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-600 text-sm">{c.company[0]}</div>
                      <div>
                        <div className="font-bold text-gray-900">{c.company}</div>
                        <div className="text-xs text-gray-500">{c.industry}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-2">{c.result}</div>
                    <div className="text-sm text-gray-500 mb-4">Workflow: <span className="font-medium text-gray-700">{c.workflow}</span></div>
                    <blockquote className="italic text-gray-600 border-l-4 border-blue-200 pl-4">
                      "{c.quote}"
                    </blockquote>
                    <p className="text-xs text-gray-500 mt-2">— {c.person}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                      <TrendingUp className="w-3 h-3" /> Verified Result
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-10 text-center">
            <Users className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Full Case Studies Coming Soon</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              We're documenting detailed breakdowns of how our workflows have transformed specific businesses. In the meantime, browse our workflow catalog or talk to our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/marketplace" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                <Zap className="w-4 h-4" /> Browse Workflows
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
