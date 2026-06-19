"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Zap, ArrowRight, ArrowLeft, CheckCircle, Loader2, DollarSign, Clock } from "lucide-react";

const steps = [
  {
    key: "businessType",
    q: "What type of business do you run?",
    options: ["E-Commerce / Retail", "SaaS / Software", "Agency / Consulting", "Healthcare", "Finance / Legal", "Coaching / Education", "Local Business", "Other"],
  },
  {
    key: "challenge",
    q: "What's your biggest operational challenge?",
    options: ["Lead generation & sales", "Customer support overload", "Content & marketing", "Internal workflows & ops", "Data & analytics", "Hiring & HR", "All of the above"],
  },
  {
    key: "teamSize",
    q: "How many people are on your team?",
    options: ["Just me", "2–10 people", "11–50 people", "51–200 people", "200+ people"],
  },
  {
    key: "budget",
    q: "What's your monthly budget for AI tools?",
    options: ["$0 (free tools only)", "Under $200/month", "$200–$500/month", "$500–$1,000/month", "$1,000+/month"],
  },
];

interface StackResult {
  summary: string;
  tools: {
    name: string;
    category: string;
    purpose: string;
    price: string;
    priority: "Must Have" | "High Priority" | "Nice to Have";
    why: string;
  }[];
  quick_wins: string[];
  estimated_monthly_cost: string;
  estimated_time_saved: string;
  next_step: string;
}

const priorityColors: Record<string, string> = {
  "Must Have": "bg-red-100 text-red-700",
  "High Priority": "bg-orange-100 text-orange-700",
  "Nice to Have": "bg-gray-100 text-gray-600",
};

export default function AIStackBuilderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StackResult | null>(null);
  const [error, setError] = useState("");

  const handleAnswer = async (answer: string) => {
    const key = steps[step].key;
    const newAnswers = { ...answers, [key]: answer };
    setAnswers(newAnswers);

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/tools/ai-stack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAnswers),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setResult(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to build your stack. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setError("");
  };

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
            <p className="text-gray-600 mt-2">4 quick questions → your personalized AI toolkit, built by AI.</p>
          </div>

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Analyzing your needs and building your stack...</p>
                <p className="text-gray-400 text-sm mt-1">This usually takes 10–15 seconds</p>
              </motion.div>
            )}

            {!loading && error && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={reset} className="text-blue-600 underline text-sm">Start over</button>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Header */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Your AI Stack is Ready</h2>
                      <p className="text-sm text-gray-500">Personalized for {answers.businessType}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{result.summary}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="font-bold text-gray-900 text-sm">{result.estimated_monthly_cost}</div>
                      <div className="text-xs text-gray-500">Est. monthly cost</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="font-bold text-gray-900 text-sm">{result.estimated_time_saved}</div>
                      <div className="text-xs text-gray-500">Time saved/week</div>
                    </div>
                  </div>
                </div>

                {/* Tools */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Your Recommended Tools</h3>
                  <div className="space-y-3">
                    {result.tools?.map((tool, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <span className="font-bold text-gray-900">{tool.name}</span>
                            <span className="text-xs text-gray-400 ml-2">{tool.category}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2 ${priorityColors[tool.priority] ?? "bg-gray-100 text-gray-600"}`}>
                            {tool.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{tool.purpose}</p>
                        <p className="text-xs text-blue-600 italic">{tool.why}</p>
                        <p className="text-xs text-gray-400 mt-1">{tool.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Wins */}
                {result.quick_wins?.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-3">⚡ Quick Wins This Week</h3>
                    <ul className="space-y-2">
                      {result.quick_wins.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Step */}
                {result.next_step && (
                  <div className="bg-blue-600 rounded-2xl p-6 text-white">
                    <p className="text-blue-100 text-sm font-medium mb-1">Your #1 Next Action</p>
                    <p className="text-white font-bold text-lg">{result.next_step}</p>
                  </div>
                )}

                {/* CTAs */}
                <div className="space-y-3">
                  <Link href="/contact" className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-semibold transition-all">
                    Get Expert Help Implementing This Stack
                  </Link>
                  <Link href="/marketplace" className="block w-full text-center border border-gray-200 text-gray-700 hover:bg-gray-50 py-3.5 rounded-xl font-semibold transition-all">
                    Browse Pre-Built Workflows
                  </Link>
                  <button onClick={reset} className="block w-full text-center text-blue-600 py-2 text-sm hover:underline">
                    Start Over with Different Answers
                  </button>
                </div>
              </motion.div>
            )}

            {!loading && !result && !error && (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-gray-200 p-8"
              >
                <div className="flex gap-1.5 mb-8">
                  {steps.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-blue-600" : "bg-gray-200"}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mb-2">Question {step + 1} of {steps.length}</p>
                <h2 className="text-xl font-bold text-gray-900 mb-6">{steps[step].q}</h2>
                <div className="space-y-3">
                  {steps[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="w-full text-left px-5 py-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group flex items-center justify-between"
                    >
                      <span className="text-gray-700 group-hover:text-blue-700 font-medium">{opt}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    onClick={() => {
                      const newAnswers = { ...answers };
                      delete newAnswers[steps[step - 1].key];
                      setAnswers(newAnswers);
                      setStep(step - 1);
                    }}
                    className="mt-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}
