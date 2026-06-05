"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bot, Zap, BarChart3, Shield, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "AI Workflow Automation",
    description:
      "Eliminate repetitive tasks with intelligent automation that learns and adapts to your business processes.",
    href: "/services",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Custom API Integrations",
    description:
      "Connect ChatGPT and 1,000+ APIs to build powerful, automated workflows tailored to your needs.",
    href: "/services",
    color: "purple",
  },
  {
    icon: BarChart3,
    title: "AI Analytics & Insights",
    description:
      "Turn raw data into actionable intelligence with AI-powered dashboards and predictive analytics.",
    href: "/services",
    color: "green",
  },
  {
    icon: Shield,
    title: "Enterprise AI Security",
    description:
      "Deploy AI with confidence. SOC 2 certified, GDPR compliant, and enterprise-grade security built in.",
    href: "/services",
    color: "orange",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
};

export default function Services() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Core Capabilities
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to scale with AI
          </h2>
          <p className="text-xl text-gray-600">
            From automation to analytics, our AI solutions are built to deliver measurable ROI from day one.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[s.color]}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{s.description}</p>
              <Link
                href={s.href}
                className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium hover:gap-2 transition-all"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
