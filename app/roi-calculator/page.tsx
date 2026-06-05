"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { DollarSign, TrendingUp } from "lucide-react";

export default function ROICalculatorPage() {
  const [employees, setEmployees] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [automationRate] = useState(0.7);

  const weeklyHoursSaved = employees * hoursPerWeek * automationRate;
  const annualSavings = weeklyHoursSaved * hourlyRate * 52;
  const roi = Math.round(((annualSavings - 12000) / 12000) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI ROI Calculator</h1>
            <p className="text-xl text-gray-600">See how much your business could save with AI automation.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Business Details</h2>
              {[
                { label: "Number of Employees", value: employees, set: setEmployees, min: 1, max: 500 },
                { label: "Average Hourly Rate ($)", value: hourlyRate, set: setHourlyRate, min: 10, max: 500 },
                { label: "Hours/week on repetitive tasks (per employee)", value: hoursPerWeek, set: setHoursPerWeek, min: 1, max: 40 },
              ].map(({ label, value, set, min, max }) => (
                <div key={label} className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <label className="font-medium text-gray-700">{label}</label>
                    <span className="font-bold text-blue-600">{value}</span>
                  </div>
                  <input type="range" min={min} max={max} value={value} onChange={(e) => set(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[
                { label: "Weekly Hours Saved", value: `${Math.round(weeklyHoursSaved)}h`, icon: TrendingUp, color: "bg-blue-50 border-blue-200 text-blue-700" },
                { label: "Annual Cost Savings", value: `$${Math.round(annualSavings).toLocaleString()}`, icon: DollarSign, color: "bg-green-50 border-green-200 text-green-700" },
                { label: "Estimated ROI", value: `${roi}%`, icon: TrendingUp, color: "bg-purple-50 border-purple-200 text-purple-700" },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl border p-6 ${s.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium opacity-70">{s.label}</div>
                      <div className="text-3xl font-black mt-1">{s.value}</div>
                    </div>
                    <s.icon className="w-8 h-8 opacity-40" />
                  </div>
                </div>
              ))}
              <a href="/contact" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105">
                Start Saving — Talk to an Expert
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
