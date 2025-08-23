export type Pillar = 'Traffic' | 'Performance' | 'SEO' | 'Pixels' | 'Tech' | 'Sitemap' | 'Messaging' | 'Social';

export type Scorecard = {
  total: number;                         // 0–100
  pillars: Record<Pillar, number>;       // each 0–100
};

export type Snapshot = {
  ts: string;            // ISO date
  trancoRank?: number;   // smaller is better
  LCP?: number;          // s
  INP?: number;          // ms
  CLS?: number;          // unitless
};

export type Report = {
  input: { url: string; domain: string };
  response: { status: number; elapsedMs: number; server?: string | null; xPoweredBy?: string | null };
  traffic: { available: boolean; trancoRank?: number; source?: string };
  performance: { weightKB?: number; reqImages?: number; reqScripts?: number; LCP?: number; INP?: number; CLS?: number; passed?: boolean };
  seo: {
    title: string; titleLength: number; metaDescription: string; metaDescriptionLength: number;
    canonical?: string | null; robotsMeta?: string | null;
    openGraphCount: number; twitterTagCount: number; jsonLdBlocks: number;
    headings: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number };
    wordCount?: number;
    images?: { total: number; withAlt: number; withoutAlt: number };
    links: { internal: number; external: number };
  };
  tech: { cms?: string | null; frameworks: string[]; evidence: string[]; thirdParties: string[] };
  tracking: { analytics: string[]; ads: string[]; tagManagers: string[]; socialPixels: string[]; consentMode?: boolean };
  robots: { robotsTxt: { present: boolean; disallowCount: number; sitemaps: string[] }; sitemaps: { url: string; urlCount: number }[] };
  messaging: { hero?: { headline?: string; subhead?: string; primaryCTA?: string }; socialProof?: string[]; risks?: string[] };
  social: { links: string[] };
  score: Scorecard;
  generatedAt: string;
};