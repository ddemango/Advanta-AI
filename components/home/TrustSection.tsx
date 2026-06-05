"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const stats = [
  { value: "500+", label: "Businesses Transformed" },
  { value: "385%", label: "Average Revenue Increase" },
  { value: "312%", label: "Average ROI in First Year" },
  { value: "94%", label: "Workflow Automation Rate" },
];

const testimonials = [
  {
    quote:
      "Advanta AI completely transformed our customer support. We went from 8-hour response times to under 2 minutes. The ROI was visible within the first month.",
    name: "Sarah Mitchell",
    title: "VP of Operations, TechScale Inc.",
    rating: 5,
  },
  {
    quote:
      "The AI automation workflows cut our manual data entry by 90%. Our team now focuses on strategy instead of repetitive tasks. Game changer.",
    name: "Marcus Chen",
    title: "CEO, GrowthForge",
    rating: 5,
  },
  {
    quote:
      "We deployed a custom AI assistant on our website in 3 days. It now handles 70% of customer inquiries automatically. Revenue up 40%.",
    name: "Priya Patel",
    title: "Director of Digital, RetailNext",
    rating: 5,
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-black text-blue-600 mb-2">{s.value}</div>
              <div className="text-sm text-gray-600 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Trusted by businesses worldwide
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <Quote className="w-8 h-8 text-blue-200 mb-4" />
              <p className="text-gray-700 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
