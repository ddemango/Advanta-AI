import { Scorecard } from '../shared/types-report';

export function computeScore(parts: any): Scorecard {
  const p: Record<string, number> = { Traffic: 0, Performance: 0, SEO: 0, Pixels: 0, Tech: 0, Sitemap: 0, Messaging: 0, Social: 0 };

  // Traffic (Tranco present + relative rank buckets)
  p.Traffic = !parts.traffic?.available ? 30 : clamp(100 - Math.log10((parts.traffic.trancoRank || 1)) * 20, 40, 95);

  // Performance (weight & CWV — placeholders if no PSI)
  const w = parts.performance?.weightKB || 0;
  let perf = 70;
  if (w > 1500) perf = 40; else if (w > 800) perf = 55; else if (w > 400) perf = 65; else perf = 80;
  if (parts.performance?.passed === true) perf = 90;
  p.Performance = clamp(perf, 0, 100);

  // SEO basics
  let seo = 0;
  if (len(parts.seo?.titleLength, 45, 65)) seo += 20;
  if (len(parts.seo?.metaDescriptionLength, 120, 170)) seo += 20;
  if (parts.seo?.headings?.h1 === 1) seo += 15;
  if (parts.seo?.jsonLdBlocks > 0) seo += 15;
  if (parts.seo?.openGraphCount > 0) seo += 10;
  if ((parts.seo?.images?.withoutAlt || 0) === 0) seo += 10;
  if (parts.seo?.canonical) seo += 10;
  p.SEO = clamp(seo, 0, 100);

  // Pixels/Ads
  const pxCount = [
    ...(parts.tracking?.analytics || []),
    ...(parts.tracking?.tagManagers || []),
    ...(parts.tracking?.socialPixels || [])
  ].length;
  p.Pixels = clamp(pxCount * 12, 20, 100);

  // Tech
  const techScore = (parts.tech?.cms ? 20 : 0) + (parts.tech?.frameworks?.length ? 20 : 0) + (parts.tech?.thirdParties?.length ? 60 : 20);
  p.Tech = clamp(techScore, 0, 100);

  // Sitemap/Pages
  const sm = parts.robots?.sitemaps?.length || 0;
  const robots = parts.robots?.robotsTxt?.present ? 30 : 0;
  p.Sitemap = clamp(robots + sm * 35, 0, 100);

  // Messaging
  let msg = 0;
  if (parts.messaging?.hero?.headline) msg += 35;
  if (parts.messaging?.hero?.primaryCTA) msg += 35;
  if ((parts.messaging?.socialProof || []).length) msg += 30;
  p.Messaging = clamp(msg, 0, 100);

  // Social
  const socialLinks = (parts.social?.links || []).length;
  p.Social = clamp(socialLinks * 20, 0, 100);

  // Weighted total
  const total = Math.round(
    p.Traffic * 0.15 + p.Performance * 0.15 + p.SEO * 0.25 + p.Pixels * 0.20 + p.Tech * 0.05 + p.Sitemap * 0.05 + p.Messaging * 0.10 + p.Social * 0.05
  );

  return { total, pillars: p as any };
}

function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }
function len(n = 0, lo: number, hi: number) { return n >= lo && n <= hi; }