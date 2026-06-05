"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle, Star } from "lucide-react";

const features = [
  "AI Workflow Automation: Free your team from manual work",
  "Custom API & ChatGPT Integrations: Smarter websites and systems",
  "Industry-Specific AI Learning: AI tailored to your business",
  "AI-Powered Customer Interactions: 24/7 automated engagement",
  "Data-Driven Optimization: Improve performance continuously",
  "Free AI Resources: Templates and tools to start automating today",
];

const stats = [
  { value: "500+", label: "Businesses Transformed" },
  { value: "2.5M+", label: "Tasks Automated" },
  { value: "85%", label: "Cost Reduction" },
  { value: "24/7", label: "AI Support" },
];

const activity = [
  { action: "Customer inquiry processed", time: "2 min ago", status: "success" },
  { action: "Lead qualified and assigned", time: "5 min ago", status: "success" },
  { action: "Report generated", time: "12 min ago", status: "processing" },
];

export default function Hero() {
  return (
    <section className="pt-24 pb-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Star className="w-4 h-4" />
              <span>AI You Can Trust</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Automate. Optimize. Scale.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Workflows
              </span>{" "}
              Built for Your Business
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Advanta AI transforms the way businesses operate. We combine APIs, ChatGPT, and intelligent
              automation tools to eliminate repetitive tasks, streamline operations, and create seamless
              ways for customers to interact with your brand.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{f}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/ai-stack-builder"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-200"
              >
                Start Automating Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
              >
                <Play className="w-5 h-5" />
                Explore AI Services
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Window dots */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="ml-3 text-sm text-gray-400 font-medium">AI Dashboard</span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-blue-600">{s.value}</div>
                    <div className="text-xs text-gray-600 mt-1">{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Activity feed */}
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</div>
                <div className="space-y-2">
                  {activity.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.15 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          a.status === "success" ? "bg-green-500" : "bg-blue-500 animate-pulse"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-700 truncate">{a.action}</div>
                        <div className="text-xs text-gray-400">{a.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg"
            >
              <CheckCircle className="w-6 h-6" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7 }}
              className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-full shadow-lg"
            >
              <Star className="w-6 h-6" />
            </motion.div>

            {/* BG gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl -z-10 transform rotate-2 scale-105" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
