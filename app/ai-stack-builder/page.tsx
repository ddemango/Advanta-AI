"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Zap, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

const steps = [
  {
    q: "What type of business do you run?",
    options: ["E-Commerce / Retail", "SaaS / Software", "Agency / Consulting", "Healthcare", "Finance / Legal", "Other"],
  },
  {
    q: "What's your biggest operational challenge?",
    options: ["Lead generation & sales", "Customer support", "Content & marketing", "Internal workflows", "Data & analytics", "All of the above"],
  },
  {
    q: "How many employees are in your company?",
    options: ["Just me", "2-10", "11-50", "51-200", "200+"],
  },
  {
    q: "What's your monthly AI tools budget?",
    options: ["$0 (free tools only)", "$50-200", "$200-500", "$500-1,000", "$1,000+"],
  },
];

const recommendations: Record<string, string[]> = {
  "E-Commerce / Retail": ["Klaviyo AI", "ChatGPT + Shopify", "Tidio AI Chat", "Triple Whale Analytics"],
  "SaaS / Software": ["Intercom AI", "Clay.com", "Jasper AI", "Mixpanel + GPT"],
  "Agency / Consulting": ["Notion AI", "HubSpot AI", "Copy.ai", "Loom AI"],
  "Healthcare": ["HIPAA-compliant GPT", "Doximity AI", "Azure Health Bot", "Epic AI"],
  "Finance / Legal": ["Harvey AI", "Ironclad AI", "Otter.ai", "Bloomberg GPT"],
  "Other": ["ChatGPT Plus", "Make.com", "Zapier AI", "Notion AI"],
};

export default function AIStackBuilderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      setLoading(false);
      setDone(true);
    }
  };

  const rec = recommendations[answers[0]] || recommendations["Other"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Build My AI Stack</h1>
            <p className="text-gray-600 mt-2">Answer 4 quick questions to get your personalized AI toolkit.</p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Building your personalized AI stack...</p>
            </div>
          ) : done ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="text-center mb-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-900">Your AI Stack is Ready! 🚀</h2>
                <p className="text-gray-600 mt-2">Based on your answers, here are the best AI tools for your business:</p>
              </div>
              <div className="space-y-3 mb-8">
                {rec.map((tool, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</div>
                    <span className="font-semibold text-gray-900">{tool}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <a href="/contact" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all">
                  Get Expert Help Implementing These Tools
                </a>
                <button onClick={() => { setStep(0); setAnswers([]); setDone(false); }} className="block w-full text-center text-blue-600 border border-blue-200 hover:bg-blue-50 py-3 rounded-xl font-medium transition-all">
                  Start Over
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-200 p-8">
              {/* Progress */}
              <div className="flex gap-1.5 mb-8">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-blue-600" : "bg-gray-200"}`} />
                ))}
              </div>
              <p className="text-xs text-gray-400 mb-2">Question {step + 1} of {steps.length}</p>
              <h2 className="text-xl font-bold text-gray-900 mb-6">{steps[step].q}</h2>
              <div className="space-y-3">
                {steps[step].options.map((opt) => (
                  <button key={opt} onClick={() => handleAnswer(opt)} className="w-full text-left px-5 py-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group flex items-center justify-between">
                    <span className="text-gray-700 group-hover:text-blue-700 font-medium">{opt}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }} className="mt-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
