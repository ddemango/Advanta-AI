import { Request, Response } from 'express';

const MOOD_GENRE_WEIGHTS: Record<string, Record<number, number>> = {
  cozy: { 35: 1.0, 10749: 0.6, 16: 0.3 },
  light: { 35: 0.8, 12: 0.6 },
  intense: { 53: 1.0, 28: 0.8, 80: 0.6 },
  smart: { 18: 0.6, 9648: 0.8, 99: 0.6, 878: 0.5 },
  gritty: { 80: 0.9, 18: 0.5, 53: 0.7 },
  comfort: { 35: 0.7, 10751: 0.6 },
  high_energy: { 28: 0.8, 12: 0.7 },
  low_energy: { 18: 0.6, 10749: 0.4 },
  multitask: { 35: 0.5, 10751: 0.4 },
  focus: { 9648: 0.7, 18: 0.6, 99: 0.6 },
};

function gauss(x: number, mu: number, sigma: number) {
  const d = x - mu;
  return Math.exp(-(d * d) / (2 * sigma * sigma));
}

function score(item: any, moods: string[], timeWindow: number) {
  const timeFit = item.runtime
    ? gauss(item.runtime, timeWindow, Math.max(15, timeWindow * 0.25))
    : 0.8;
  const mood = moods.reduce((acc, m) => {
    const w = MOOD_GENRE_WEIGHTS[m] || {};
    return acc + (item.genres?.reduce((s: number, g: number) => s + (w[g] || 0), 0) || 0);
  }, 0);
  const recency = item.year
    ? Math.max(0, Math.min(1, (item.year - 1990) / 35))
    : 0.3;
  const pop = item.popularity ? Math.min(1, item.popularity / 100) : 0.3;
  return 0.35 * timeFit + 0.25 * (mood / 2) + 0.2 * recency + 0.2 * pop;
}

export async function POST(req: Request, res: Response) {
  try {
    const { candidates = [], moods = [], timeWindow = 120 } = req.body;
    
    if (!Array.isArray(candidates)) {
      return res.status(400).json({ error: 'candidates required' });
    }
    if (!moods.length) {
      return res.status(400).json({ error: 'moods required' });
    }

    const items = candidates
      .map((c: any) => ({
        ...c,
        match_score: Math.round(score(c, moods, timeWindow) * 100),
      }))
      .sort((a: any, b: any) => (b.match_score || 0) - (a.match_score || 0))
      .slice(0, 30);

    res.json({ items, total: items.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'rerank_failed' });
  }
}