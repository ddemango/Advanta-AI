"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Loader2, ChevronDown, ChevronUp, Zap } from "lucide-react";
import ToolLayout, { ResultCard, BulletList } from "@/components/tools/ToolLayout";

const goals = ["Lose weight & burn fat", "Build muscle & strength", "Improve endurance & cardio", "Get toned & lean", "Increase flexibility", "General fitness & health"];
const levels = ["Complete beginner", "Some experience", "Intermediate", "Advanced"];
const equipmentOptions = ["No equipment (bodyweight)", "Dumbbells only", "Resistance bands", "Full gym access", "Home gym", "Kettlebells"];

export default function WorkoutPlannerPage() {
  const [form, setForm] = useState({ goal: "", fitness_level: "Some experience", equipment: "", days_per_week: "4", session_length: "45 minutes", limitations: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDay, setOpenDay] = useState(0);
  const [selectedEquip, setSelectedEquip] = useState<string[]>([]);

  const toggleEquip = (e: string) => {
    const next = selectedEquip.includes(e) ? selectedEquip.filter(x => x !== e) : [...selectedEquip, e];
    setSelectedEquip(next);
    setForm(v => ({ ...v, equipment: next.join(", ") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/workout-planner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to generate plan."); }
      setResult(await res.json()); setOpenDay(0);
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <ToolLayout title="AI Workout Planner" description="Get a personalized weekly workout plan built around your goal, level, and equipment." icon={<Dumbbell className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Your Goal *</label>
              <div className="space-y-2">
                {goals.map(g => (
                  <button key={g} type="button" onClick={() => setForm(v => ({ ...v, goal: g }))} className={`w-full text-left text-sm px-3 py-2 rounded-xl border transition-colors ${form.goal === g ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-700 hover:border-blue-300"}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Fitness Level</label>
              <div className="grid grid-cols-2 gap-2">
                {levels.map(l => (
                  <button key={l} type="button" onClick={() => setForm(v => ({ ...v, fitness_level: l }))} className={`text-xs px-3 py-2 rounded-xl border transition-colors ${form.fitness_level === l ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Equipment Available</label>
              <div className="flex flex-wrap gap-2">
                {equipmentOptions.map(e => (
                  <button key={e} type="button" onClick={() => toggleEquip(e)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedEquip.includes(e) ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-300"}`}>{e}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Days/Week</label>
                <select value={form.days_per_week} onChange={e => setForm(v => ({ ...v, days_per_week: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["2", "3", "4", "5", "6"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Session Length</label>
                <select value={form.session_length} onChange={e => setForm(v => ({ ...v, session_length: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["20 minutes", "30 minutes", "45 minutes", "60 minutes", "75 minutes", "90 minutes"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Injuries / Limitations</label>
              <input value={form.limitations} onChange={e => setForm(v => ({ ...v, limitations: e.target.value }))} placeholder="e.g. bad knees, lower back pain" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.goal} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Building Your Plan...</> : <><Dumbbell className="w-4 h-4" />Generate My Plan</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center min-h-64">
              <Dumbbell className="w-14 h-14 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">Your personalized workout plan will appear here</p>
              <p className="text-gray-300 text-sm mt-1">Full weekly schedule with exercises, sets, reps & tips</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold text-blue-200 uppercase mb-1">Your Plan</p>
                <p className="text-xl font-black">{result.plan_name}</p>
                <p className="text-blue-100 text-sm mt-1">{result.goal_summary}</p>
                {result.weekly_tip && <div className="mt-3 bg-white/20 rounded-xl px-4 py-2 text-sm"><Zap className="w-4 h-4 inline mr-1" />{result.weekly_tip}</div>}
              </div>

              <div className="space-y-2">
                {result.weekly_schedule?.map((day: any, i: number) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <button onClick={() => setOpenDay(openDay === i ? -1 : i)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white ${day.focus?.toLowerCase().includes("rest") ? "bg-gray-300" : "bg-blue-600"}`}>{i + 1}</span>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 text-sm">{day.day}</p>
                          <p className="text-xs text-gray-500">{day.focus} · {day.duration}</p>
                        </div>
                      </div>
                      {openDay === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {openDay === i && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                        {day.warmup && <div className="text-xs bg-yellow-50 text-yellow-700 rounded-lg px-3 py-2"><strong>Warm-up:</strong> {day.warmup}</div>}
                        <div className="space-y-2">
                          {day.exercises?.map((ex: any, j: number) => (
                            <div key={j} className="bg-gray-50 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-gray-900 text-sm">{ex.name}</p>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{ex.sets} × {ex.reps}</span>
                              </div>
                              <p className="text-xs text-gray-500">Rest: {ex.rest}</p>
                              {ex.tip && <p className="text-xs text-blue-600 mt-1 italic">💡 {ex.tip}</p>}
                            </div>
                          ))}
                        </div>
                        {day.cooldown && <div className="text-xs bg-green-50 text-green-700 rounded-lg px-3 py-2"><strong>Cool-down:</strong> {day.cooldown}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {result.nutrition_tips?.length > 0 && <ResultCard title="🥗 Nutrition Tips"><BulletList items={result.nutrition_tips} /></ResultCard>}
                {result.recovery_tips?.length > 0 && <ResultCard title="😴 Recovery Tips"><BulletList items={result.recovery_tips} /></ResultCard>}
              </div>
              {result.progress_milestones?.length > 0 && (
                <ResultCard title="🏆 Progress Milestones">
                  <ol className="space-y-2">{result.progress_milestones.map((m: string, i: number) => <li key={i} className="flex gap-2 text-sm text-gray-700"><span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>{m}</li>)}</ol>
                </ResultCard>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
