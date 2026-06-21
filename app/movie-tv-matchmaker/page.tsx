"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Loader2, Tv, Star } from "lucide-react";
import ToolLayout, { ResultCard } from "@/components/tools/ToolLayout";

const streamingOptions = ["Netflix", "Hulu", "Disney+", "HBO Max", "Amazon Prime", "Apple TV+", "Peacock", "Paramount+", "Any"];

export default function MovieMatchmakerPage() {
  const [form, setForm] = useState({ mood: "", genres: "", loved: "", disliked: "", streaming: "", type: "both movies and shows", length: "any" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleStreaming = (s: string) => {
    const next = selected.includes(s) ? selected.filter(x => x !== s) : [...selected, s];
    setSelected(next);
    setForm(v => ({ ...v, streaming: next.join(", ") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/tools/movie-matchmaker", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed to get recommendations."); }
      setResult(await res.json());
    } catch (err: any) { setError(err?.message || "Failed. Please try again."); }
    finally { setLoading(false); }
  };

  const typeColor: Record<string, string> = { Movie: "bg-blue-100 text-blue-700", "TV Show": "bg-purple-100 text-purple-700" };

  return (
    <ToolLayout title="Movie & TV Show Matchmaker" description="Tell us your mood and taste — get personalized picks you'll actually watch." icon={<Film className="w-6 h-6 text-blue-600" />}>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Your Current Mood *</label>
              <input value={form.mood} onChange={e => setForm(v => ({ ...v, mood: e.target.value }))} placeholder="e.g. Need something funny and light, feeling adventurous, want to cry" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Favorite Genres</label>
              <input value={form.genres} onChange={e => setForm(v => ({ ...v, genres: e.target.value }))} placeholder="e.g. Thriller, Comedy, Sci-Fi, True Crime" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Shows/Movies You Loved</label>
              <input value={form.loved} onChange={e => setForm(v => ({ ...v, loved: e.target.value }))} placeholder="e.g. Breaking Bad, The Office, Inception" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">What You Don't Like</label>
              <input value={form.disliked} onChange={e => setForm(v => ({ ...v, disliked: e.target.value }))} placeholder="e.g. Horror, slow burns, subtitles" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Streaming Services</label>
              <div className="flex flex-wrap gap-2">
                {streamingOptions.map(s => (
                  <button key={s} type="button" onClick={() => toggleStreaming(s)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${selected.includes(s) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Looking For</label>
                <select value={form.type} onChange={e => setForm(v => ({ ...v, type: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["both movies and shows", "movies only", "TV shows only"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Length</label>
                <select value={form.length} onChange={e => setForm(v => ({ ...v, length: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["any", "short (under 90 min)", "standard (90-120 min)", "mini-series", "long-running series"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !form.mood} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Finding Your Matches...</> : <><Film className="w-4 h-4" />Find My Matches</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!result ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center min-h-64">
              <Film className="w-14 h-14 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">Your personalized picks will appear here</p>
              <p className="text-gray-300 text-sm mt-1">6 main picks + 3 hidden gems</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {result.mood_summary && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 text-white">
                  <p className="text-xs font-semibold text-blue-200 uppercase mb-1">Your Vibe Tonight</p>
                  <p className="font-medium">{result.mood_summary}</p>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {result.picks?.map((pick: any, i: number) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColor[pick.type] || "bg-gray-100 text-gray-600"}`}>{pick.type}</span>
                      <div className="flex items-center gap-1 text-yellow-500"><Star className="w-3.5 h-3.5 fill-yellow-400" /><span className="text-xs font-bold text-gray-700">{pick.rating}</span></div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{pick.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">{pick.year} · {pick.genre} · {pick.seasons_or_runtime}</p>
                    <div className="bg-blue-50 rounded-xl p-3 mb-3">
                      <p className="text-xs font-semibold text-blue-600 mb-1">Why you'll love it</p>
                      <p className="text-sm text-blue-800">{pick.why_youll_love_it}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">🎭 {pick.vibe}</span>
                      <span className="text-xs text-green-600 font-semibold">📺 {pick.streaming_on}</span>
                    </div>
                  </div>
                ))}
              </div>
              {result.hidden_gems?.length > 0 && (
                <ResultCard title="💎 Hidden Gems">
                  <div className="space-y-3">
                    {result.hidden_gems.map((gem: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-yellow-50 rounded-xl p-3">
                        <span className="text-yellow-400 text-lg">💎</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{gem.title}</p>
                          <p className="text-xs text-gray-500 mb-1">{gem.streaming_on}</p>
                          <p className="text-sm text-gray-700">{gem.why}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
