import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Bot, Zap, BarChart3, Shield, Globe, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "AI Services - Advanta AI" };

const services = [
  { icon: Bot, title: "AI Workflow Automation", desc: "Eliminate manual, repetitive tasks with intelligent automation that learns and adapts to your processes.", features: ["Process mapping & optimization", "Integration with 1,000+ tools", "Self-healing workflows", "Real-time monitoring"] },
  { icon: Zap, title: "Custom API Integrations", desc: "Connect ChatGPT and any API to build powerful, data-driven automations tailored to your business.", features: ["Custom ChatGPT integrations", "REST & GraphQL API support", "Webhook management", "OAuth authentication"] },
  { icon: Globe, title: "Website AI Assistants", desc: "Embed an intelligent AI assistant on your website that answers questions, qualifies leads, and converts visitors.", features: ["Natural language understanding", "Lead qualification", "CRM integration", "Custom branding"] },
  { icon: BarChart3, title: "AI Analytics & Insights", desc: "Turn raw data into actionable intelligence with dashboards, reports, and predictive analytics.", features: ["Natural language queries", "Automated reporting", "Anomaly detection", "Predictive modeling"] },
  { icon: Shield, title: "Enterprise AI Security", desc: "Deploy AI with confidence — SOC 2 certified, GDPR compliant, and enterprise-grade security built in.", features: ["SOC 2 Type II certified", "GDPR & CCPA compliance", "Role-based access control", "Audit logging"] },
  { icon: Users, title: "Industry-Specific AI", desc: "Pre-built AI solutions tailored to your industry — from healthcare to e-commerce to financial services.", features: ["Healthcare AI workflows", "E-commerce automation", "Financial services AI", "Legal document processing"] },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Core AI Capabilities</h1>
            <p className="text-xl text-gray-600">Enterprise AI solutions designed to deliver measurable ROI from day one.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <s.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{s.desc}</p>
                  <ul className="space-y-1.5 mb-4">
                    {s.features.map((f) => <li key={f} className="text-sm text-gray-600 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />{f}</li>)}
                  </ul>
                  <Link href="/contact" className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium hover:gap-2 transition-all">Get started <ArrowRight className="w-4 h-4" /></Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
