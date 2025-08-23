// server/marketing.ts
import fetch from 'node-fetch';

export type Marketing = {
  provider: 'similarweb'|'semrush'|'rank-proxy'|'none';
  confidence: 'high'|'medium'|'low';
  monthlyVisits?: number;
  pagesPerVisit?: number;
  avgVisitDurationSec?: number;
  bounceRate?: number;             // 0..1
  sources?: { direct?: number; search?: number; social?: number; referrals?: number; mail?: number; display?: number; paid?: number }; // shares 0..1
  topCountries?: Array<{ country: string; share: number }>;
  estConcurrentNow?: number;       // estimated "active users" on site
};

/** Public: try Similarweb -> Semrush -> fallback ranks */
export async function getMarketing(domain: string): Promise<Marketing> {
  const sw = await getSimilarweb(domain);
  if (sw) return { ...sw, provider: 'similarweb', confidence: 'medium', estConcurrentNow: estimateConcurrent(sw.monthlyVisits, sw.avgVisitDurationSec) };

  const sr = await getSemrush(domain);
  if (sr) return { ...sr, provider: 'semrush', confidence: 'medium', estConcurrentNow: estimateConcurrent(sr.monthlyVisits!, sr.avgVisitDurationSec!) };

  return { provider: 'rank-proxy', confidence: 'low' };
}

/** Similarweb API (requires key). Populate what you have; leave undefineds if missing. */
async function getSimilarweb(domain: string): Promise<Partial<Marketing> | null> {
  const key = process.env.SIMILARWEB_API_KEY;
  if (!key) return null;
  try {
    const base = 'https://api.similarweb.com/v1/website';
    const d = encodeURIComponent(domain);

    // Visits (last full month)
    const visitsRes = await fetch(`${base}/${d}/traffic-and-engagement/visits?api_key=${key}&granularity=monthly&main_domain_only=true&start_date=last_1_month&country=world`);
    if (!visitsRes.ok) return null;
    const visitsJson: any = await visitsRes.json();
    const last = (visitsJson?.visits || []).at(-1);
    const monthlyVisits = Math.round(last?.visits || 0);

    // Engagement
    const engRes = await fetch(`${base}/${d}/traffic-and-engagement/visits-and-duration?api_key=${key}&start_date=last_1_month&country=world`);
    const engJson: any = await engRes.json();
    const avgVisitDurationSec = Math.round(engJson?.avg_visit_duration || 0);
    const pagesPerVisit = Number(engJson?.pages_per_visit || 0);
    const bounceRate = Number(engJson?.bounce_rate || 0);

    // Sources share
    const srcRes = await fetch(`${base}/${d}/traffic-sources/overview-share?api_key=${key}&start_date=last_1_month&country=world`);
    const srcJson: any = await srcRes.json();
    const sources = srcJson?.shares || undefined;

    // Top countries (optional)
    const geoRes = await fetch(`${base}/${d}/geo/traffic-by-country?api_key=${key}&start_date=last_1_month`);
    const geoJson: any = await geoRes.json();
    const topCountries = (geoJson?.traffic_by_country || []).slice(0,5).map((r: any) => ({ country: r.country, share: r.share }));

    return { monthlyVisits, pagesPerVisit, avgVisitDurationSec, bounceRate, sources, topCountries };
  } catch { return null; }
}

/** Semrush lightweight fallback (requires key). This uses their domain overview. */
async function getSemrush(domain: string): Promise<Partial<Marketing> | null> {
  const key = process.env.SEMRUSH_API_KEY;
  if (!key) return null;
  try {
    // This endpoint returns estimated monthly visits & engagement for domain if your plan supports it.
    const url = `https://api.semrush.com/reports/v1/projects/analytics/traffic?key=${key}&domain=${encodeURIComponent(domain)}&display_limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const txt = await res.text();
    // parse CSV-ish; adapt to your plan's format
    const [header, row] = txt.trim().split('\n');
    const cols = row?.split(';') || [];
    const monthlyVisits = Number(cols[/* visits idx */ 2] || 0) || 0;
    const pagesPerVisit = Number(cols[/* pages/visit idx */ 4] || 0) || 0;
    const avgVisitDurationSec = Number(cols[/* duration sec idx */ 5] || 0) || 0;
    const bounceRate = Number(cols[/* bounce idx */ 6] || 0) || 0;
    return { monthlyVisits, pagesPerVisit, avgVisitDurationSec, bounceRate };
  } catch { return null; }
}

/** Concurrent users estimate from monthly visits + avg session duration. */
export function estimateConcurrent(monthlyVisits = 0, avgDurationSec = 0) {
  if (!monthlyVisits || !avgDurationSec) return undefined;
  // baseline concurrent = (daily visits * avg session seconds) / seconds per day
  const dailyVisits = monthlyVisits / 30;
  const baseline = (dailyVisits * avgDurationSec) / 86400; // 24*60*60
  // gently bias toward US business hours if unknown (x1.3 daytime, x0.7 nighttime)
  return Math.max(1, Math.round(baseline));
}