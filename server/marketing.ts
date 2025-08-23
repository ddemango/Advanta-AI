// server/marketing.ts
import fetch from 'node-fetch';

export type Marketing = {
  provider: 'similarweb'|'semrush'|'rank-proxy'|'none';
  confidence: 'high'|'medium'|'low';
  monthlyVisits?: number;
  pagesPerVisit?: number;
  avgVisitDurationSec?: number;
  bounceRate?: number; // 0..1
  sources?: { direct?: number; search?: number; social?: number; referrals?: number; mail?: number; display?: number; paid?: number };
  topCountries?: Array<{ country: string; share: number }>;
  estConcurrentNow?: number;
};

export async function getMarketing(domain: string): Promise<Marketing> {
  const sw = await getSimilarweb(domain);
  if (sw) {
    return {
      provider: 'similarweb',
      confidence: 'medium',
      ...sw,
      estConcurrentNow: estimateConcurrent(sw.monthlyVisits, sw.avgVisitDurationSec),
    };
  }
  return { provider: 'rank-proxy', confidence: 'low' };
}

/** Similarweb v1 Website API (uses last full month). Requires SIMILARWEB_API_KEY. */
async function getSimilarweb(domain: string): Promise<Partial<Marketing> | null> {
  const key = process.env.SIMILARWEB_API_KEY;
  if (!key) return null;

  const base = 'https://api.similarweb.com/v1/website';
  const d = encodeURIComponent(domain);

  try {
    // Visits (monthly)
    const v = await fetch(`${base}/${d}/traffic-and-engagement/visits?api_key=${key}&granularity=monthly&main_domain_only=true&start_date=last_1_month&country=world`);
    if (!v.ok) return null;
    const vj: any = await v.json();
    const last = (vj?.visits || []).at(-1);
    const monthlyVisits = Math.round(last?.visits || 0);

    // Engagement (pages/visit, duration, bounce)
    const e = await fetch(`${base}/${d}/traffic-and-engagement/visits-and-duration?api_key=${key}&start_date=last_1_month&country=world`);
    const ej: any = await e.json();
    const pagesPerVisit = Number(ej?.pages_per_visit || 0);
    const avgVisitDurationSec = Math.round(ej?.avg_visit_duration || 0);
    const bounceRate = Number(ej?.bounce_rate || 0);

    // Source shares
    const s = await fetch(`${base}/${d}/traffic-sources/overview-share?api_key=${key}&start_date=last_1_month&country=world`);
    const sj: any = await s.json();
    const shares = sj?.shares || {}; // keys: Direct, Search, Social, Referrals, Mail, Display, Paid
    const sources = normalizeSources(shares);

    // Top countries (optional)
    let topCountries: { country: string; share: number }[] | undefined;
    try {
      const g = await fetch(`${base}/${d}/geo/traffic-by-country?api_key=${key}&start_date=last_1_month&country=world`);
      const gj: any = await g.json();
      topCountries = (gj?.traffic_by_country || [])
        .slice(0, 5)
        .map((r: any) => ({ country: r.country, share: Number(r.share || 0) }));
    } catch { /* ignore */ }

    return { monthlyVisits, pagesPerVisit, avgVisitDurationSec, bounceRate, sources, topCountries };
  } catch {
    return null;
  }
}

function normalizeSources(src: any) {
  // Similarweb returns PascalCase keys; map to our schema and clamp to [0,1]
  const clamp = (n: any) => Math.max(0, Math.min(1, Number(n || 0)));
  return {
    direct: clamp(src?.Direct),
    search: clamp(src?.Search),
    social: clamp(src?.Social),
    referrals: clamp(src?.Referrals),
    mail: clamp(src?.Mail),
    display: clamp(src?.Display),
    paid: clamp(src?.Paid),
  };
}

/** Estimated concurrent = (daily visits * avg session seconds) / 86400. */
export function estimateConcurrent(monthlyVisits = 0, avgDurationSec = 0) {
  if (!monthlyVisits || !avgDurationSec) return undefined;
  const daily = monthlyVisits / 30;
  return Math.max(1, Math.round((daily * avgDurationSec) / 86400));
}