import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CheckCircle, Users, Zap, Globe, ArrowRight, Lightbulb, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Davide Demango — Founder & CEO of Advanta AI",
  description:
    "Learn about Davide Demango, founder and CEO of Advanta AI. Davide built Advanta AI to make enterprise-grade artificial intelligence accessible to every business — no code, no delay, just results.",
  alternates: { canonical: "https://advanta-ai.com/about" },
  openGraph: {
    title: "About Davide Demango — Founder & CEO of Advanta AI",
    description:
      "Davide Demango founded Advanta AI to help businesses deploy AI assistants, automate processes, and scale faster using cutting-edge AI tools.",
    url: "https://advanta-ai.com/about",
    type: "profile",
  },
};

const stats = [
  { icon: Users, label: "Businesses Transformed", value: "500+" },
  { icon: Globe, label: "Countries Served", value: "30+" },
  { icon: Zap, label: "Tasks Automated Monthly", value: "2.5M+" },
  { icon: CheckCircle, label: "Client Satisfaction", value: "98%" },
];

const values = [
  {
    icon: Lightbulb,
    title: "Accessible AI",
    description:
      "We believe every business — whether a two-person startup or a 500-person company — deserves access to the same AI capabilities as Fortune 500 enterprises.",
  },
  {
    icon: Target,
    title: "Results Over Hype",
    description:
      "The AI industry is full of buzzwords. We cut through the noise and focus on measurable outcomes: tasks automated, hours saved, revenue generated.",
  },
  {
    icon: Zap,
    title: "Speed to Value",
    description:
      "Most AI projects take months to show ROI. We deploy working automations in days, so you see results — and build confidence — fast.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">

        {/* Founder Hero */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm mb-3">
                  Founded by
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Davide Demango
                </h1>
                <p className="text-lg text-blue-700 font-medium mb-6">
                  Founder &amp; CEO, Advanta AI
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Davide Demango is an entrepreneur and AI strategist who founded Advanta AI
                  with a single conviction: artificial intelligence should not be reserved for
                  companies with million-dollar R&amp;D budgets. Every business — from local
                  service providers to e-commerce brands to professional firms — should be
                  able to harness AI to compete, grow, and serve their customers better.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Under Davide&apos;s leadership, Advanta AI has grown from a boutique
                  consulting practice into a full-stack AI platform serving 500+ businesses
                  across 30 countries. The company has automated over 2.5 million business
                  tasks monthly and become a trusted partner for companies that want to move
                  fast without sacrificing quality.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Work With Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Founder card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6">
                  DD
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Davide Demango</h2>
                  <p className="text-blue-600 font-medium">Founder &amp; CEO</p>
                </div>
                <div className="space-y-3">
                  {[
                    "AI Automation Strategy",
                    "Business Process Optimization",
                    "ChatGPT &amp; API Integrations",
                    "Custom AI Workflow Design",
                    "AI Consulting for SMBs",
                  ].map((skill) => (
                    <div key={skill} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span
                        className="text-gray-700 text-sm"
                        dangerouslySetInnerHTML={{ __html: skill }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Davide Demango founded Advanta AI to give every business access to the same
                AI power that&apos;s currently only available to the biggest companies in the world.
                No code. No delay. Just results.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((v) => (
                <div key={v.title} className="bg-gray-50 rounded-2xl p-8">
                  <v.icon className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{v.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon className="w-8 h-8 text-blue-200 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-blue-200 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              The Advanta AI Story
            </h2>
            <div className="prose prose-lg text-gray-600 space-y-6">
              <p>
                Davide Demango started Advanta AI after watching too many businesses struggle
                with the same problem: they knew AI could help them, but they had no idea
                where to start or who to trust. The market was full of expensive consultants,
                vague promises, and tools that required a developer to configure.
              </p>
              <p>
                The solution Davide built was different — a platform and team that combines
                deep AI expertise with real-world business thinking. Advanta AI doesn&apos;t just
                integrate tools; it designs end-to-end workflows that fit how a business
                actually operates, then deploys them fast.
              </p>
              <p>
                Today, Advanta AI serves businesses in retail, real estate, healthcare,
                professional services, e-commerce, and more. The company offers 30+ free AI
                tools, a marketplace of pre-built automations, and custom AI deployment
                services — all built on the belief that the best AI is the AI that actually
                gets used.
              </p>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
              >
                See What We Build <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
