import { Router } from 'express';
import * as cheerio from 'cheerio';

const router = Router();

type TrackerHit = {
  analytics: string[];
  ads: string[];
  tagManagers: string[];
  socialPixels: string[];
};

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';

function normalizeUrl(input: string): URL {
  try {
    const url = new URL(input);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('invalid protocol');
    return url;
  } catch {
    return new URL(`https://${input}`);
  }
}

function pickDomain(u: URL): string {
  return u.hostname.replace(/^www\./i, '');
}

function timeLimit<T>(p: Promise<T>, ms = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then(v => { clearTimeout(t); resolve(v); }).catch(e => { clearTimeout(t); reject(e); });
  });
}

async function fetchText(url: string, init: RequestInit = {}): Promise<{text: string; res: Response; ms: number}> {
  const start = Date.now();
  const res = await fetch(url, {
    ...init,
    headers: { 'user-agent': UA, ...(init.headers || {}) },
    cache: 'no-store',
  });
  const text = await res.text();
  return { text, res, ms: Date.now() - start };
}

function parseSEO($: cheerio.CheerioAPI) {
  const title = $('title').first().text().trim() || '';
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
  const canonical = $('link[rel="canonical"]').attr('href') || null;
  const robotsMeta = $('meta[name="robots"]').attr('content') || null;

  const og = $('meta[property^="og:"]').length;
  const tw = $('meta[name^="twitter:"]').length;
  const jsonLdBlocks = $('script[type="application/ld+json"]').length;

  const headings = {
    h1: $('h1').length,
    h2: $('h2').length,
    h3: $('h3').length,
    h4: $('h4').length,
    h5: $('h5').length,
    h6: $('h6').length,
  };

  const imgs = $('img').toArray();
  const withAlt = imgs.filter(i => !!($(i).attr('alt') || '').trim()).length;
  const images = { total: imgs.length, withAlt, withoutAlt: imgs.length - withAlt };

  // Links
  const a = $('a[href]').toArray().map(e => ($(e).attr('href') || '').trim());
  const internal = a.filter(h => h.startsWith('/') || h.startsWith('#') || (!/^https?:\/\//i.test(h))).length;
  const external = a.filter(h => /^https?:\/\//i.test(h)).length;

  return {
    title,
    titleLength: title.length,
    metaDescription,
    metaDescriptionLength: metaDescription.length,
    canonical,
    robotsMeta,
    openGraphCount: og,
    twitterTagCount: tw,
    jsonLdBlocks,
    headings,
    images,
    links: { internal, external }
  };
}

function detectTech(html: string, $: cheerio.CheerioAPI) {
  const evid: string[] = [];
  let cms: string | null = null;
  const frameworks: string[] = [];

  if (html.includes('wp-content') || html.includes('wp-json')) { cms = 'WordPress'; evid.push('wp-content'); }
  if (html.includes('cdn.shopify.com')) { cms = 'Shopify'; evid.push('cdn.shopify.com'); }
  if (html.includes('__NEXT_DATA__') || $('script[id="__NEXT_DATA__"]').length) { frameworks.push('Next.js'); evid.push('__NEXT_DATA__'); }
  if (html.includes('data-reactroot') || html.includes('React.createElement')) { frameworks.push('React'); evid.push('React signature'); }
  if (html.includes('window.__NUXT__')) { frameworks.push('Nuxt'); evid.push('__NUXT__'); }
  if (html.includes('_nuxt/')) { frameworks.push('Nuxt'); evid.push('_nuxt/'); }
  if (html.includes('angular') || $('script[src*="angular"]').length) { frameworks.push('Angular'); evid.push('Angular'); }
  if (html.includes('vue') || $('script[src*="vue"]').length) { frameworks.push('Vue.js'); evid.push('Vue'); }

  return { cms, frameworks, evidence: evid };
}

function detectTrackers($: cheerio.CheerioAPI): TrackerHit {
  const srcs: string[] = [];
  const inlines: string[] = [];
  $('script').each((_, el) => {
    const src = $(el).attr('src');
    if (src) srcs.push(src);
    else inlines.push($(el).text() || '');
  });

  const hits: TrackerHit = { analytics: [], ads: [], tagManagers: [], socialPixels: [] };
  const test = (re: RegExp) => srcs.some(s => re.test(s)) || inlines.some(c => re.test(c));

  // Analytics
  if (test(/googletagmanager\.com\/gtag\/js/i)) hits.analytics.push('Google Analytics (gtag.js)');
  if (test(/www\.google-analytics\.com\/analytics\.js/i)) hits.analytics.push('Universal Analytics');
  if (test(/hotjar\.com\/c\/|static\.hotjar\.com/i)) hits.analytics.push('Hotjar');
  if (test(/cdn\.segment\.com\/analytics\.js/i)) hits.analytics.push('Segment');
  if (test(/cdn\.mixpanel\.com|mixpanel\.com\/site_media/i)) hits.analytics.push('Mixpanel');
  if (test(/amplitude\.com|cdn\.amplitude\.com/i)) hits.analytics.push('Amplitude');
  if (test(/fullstory\.com|fs\.js/i)) hits.analytics.push('FullStory');

  // Ads
  if (test(/googletagservices\.com|doubleclick\.net|googlesyndication\.com/i)) hits.ads.push('Google Ads / DoubleClick');
  if (test(/taboola\.com|outbrain\.com/i)) hits.ads.push('Native Ads (Taboola/Outbrain)');
  if (test(/amazon-adsystem\.com|adsystem\.amazon/i)) hits.ads.push('Amazon DSP');
  if (test(/criteo\.com|criteo\.net/i)) hits.ads.push('Criteo');

  // Tag managers
  if (test(/gtm\.js|googletagmanager\.com/i)) hits.tagManagers.push('Google Tag Manager');
  if (test(/cdn\.segment\.com\/analytics\.js|tealium|tagcommander/i)) hits.tagManagers.push('Other TMS');
  if (test(/ensighten\.com|satellite/i)) hits.tagManagers.push('Adobe Launch');

  // Social pixels
  if (test(/connect\.facebook\.net\/.+\/fbevents\.js/i)) hits.socialPixels.push('Meta Pixel');
  if (test(/snap\.sc\/static\/pixie/i)) hits.socialPixels.push('Snap Pixel');
  if (test(/static\.ads-twitter\.com\/uwt\.js/i)) hits.socialPixels.push('Twitter Pixel');
  if (test(/pinterest\.com\/ct\/|pintrk/i)) hits.socialPixels.push('Pinterest Pixel');
  if (test(/linkedin\.com\/li\.lms/i)) hits.socialPixels.push('LinkedIn Insight');

  return hits;
}

async function getRobotsAndSitemaps(origin: string) {
  const robotsUrl = `${origin}/robots.txt`;
  try {
    const { text, res } = await timeLimit(fetchText(robotsUrl));
    if (!res.ok) return { robotsTxt: { present: false, disallowCount: 0, sitemaps: [] }, sitemaps: [] };

    const lines = text.split('\n');
    const disallowCount = lines.filter(l => /^disallow:/i.test(l)).length;
    const sitemaps = lines.filter(l => /^sitemap:/i.test(l))
      .map(l => l.split(':')[1] ? l.split(':').slice(1).join(':').trim() : '')
      .filter(Boolean);

    const sitemapSummaries = [];
    for (const sm of sitemaps.slice(0, 3)) { // safety limit
      try {
        const { text: smText } = await timeLimit(fetchText(sm, { redirect: 'follow' }));
        const count = (smText.match(/<loc>/g) || []).length || 0;
        sitemapSummaries.push({ url: sm, urlCount: count });
      } catch { /* ignore */ }
    }

    return { robotsTxt: { present: true, disallowCount, sitemaps }, sitemaps: sitemapSummaries };
  } catch {
    return { robotsTxt: { present: false, disallowCount: 0, sitemaps: [] }, sitemaps: [] };
  }
}

async function getRDAP(domain: string) {
  if (process.env.ALLOW_RDAP !== 'true') return { available: false };
  try {
    const { text, res } = await timeLimit(fetchText(`https://rdap.org/domain/${domain}`));
    if (!res.ok) return { available: false };
    const json = JSON.parse(text);
    // Find creation event
    const ev = (json.events || []).find((e: any) => e.eventAction === 'registration');
    const created = ev?.eventDate || null;
    let ageDays = null;
    if (created) {
      const d = new Date(created).getTime();
      ageDays = Math.floor((Date.now() - d) / 86400000);
    }
    return { available: true, created, ageDays, source: 'RDAP' };
  } catch { return { available: false }; }
}

async function getTrancoRank(domain: string) {
  const base = process.env.TRANCO_API_BASE;
  const key = process.env.TRANCO_API_KEY;
  if (!base || !key) return { available: false };
  try {
    const { text, res } = await timeLimit(fetchText(`${base}/ranks/${domain}`, {
      headers: { Authorization: `Bearer ${key}` }
    }));
    if (!res.ok) return { available: false };
    const data = JSON.parse(text);
    // Expected shape: { rank: number }
    return { available: true, trancoRank: data.rank, source: 'Tranco' };
  } catch { return { available: false }; }
}

function recommend(seo: any, tracking: TrackerHit, robots: any) {
  const recs: string[] = [];
  if (!seo.title || seo.titleLength < 15 || seo.titleLength > 60) recs.push('Optimise <title> to ~50–60 chars with primary keyword + benefit.');
  if (!seo.metaDescription || seo.metaDescriptionLength < 120 || seo.metaDescriptionLength > 170) recs.push('Write a compelling meta description (~140–160 chars) with a CTA.');
  if (seo.headings.h1 !== 1) recs.push('Ensure exactly one <h1> that states the primary topic clearly.');
  if (!seo.canonical) recs.push('Add <link rel="canonical"> to prevent duplicate-content dilution.');
  if (seo.images.withoutAlt > 0) recs.push('Add descriptive alt text to images to improve accessibility and image SEO.');
  if (seo.jsonLdBlocks === 0) recs.push('Add JSON-LD structured data (Organization, WebSite, Breadcrumb, Product/FAQ as relevant).');
  if (!robots.robotsTxt.present) recs.push('Publish robots.txt with clear crawl rules and a sitemap reference.');
  if (!robots.robotsTxt.sitemaps?.length) recs.push('Add sitemap.xml and submit to GSC; link it in robots.txt.');
  if (tracking.analytics.length === 0) recs.push('Install analytics (e.g., GA4) to measure acquisition and outcomes.');
  if (tracking.ads.length === 0) recs.push('Consider paid media tests; add conversion tags and offline upload if applicable.');
  if (tracking.tagManagers.length === 0) recs.push('Adopt a tag manager to manage pixels and QA changes safely.');
  return recs;
}

// API endpoint
router.post('/scan', async (req, res) => {
  try {
    const raw = (req.body?.url || '').toString().trim();
    if (!raw) return res.status(400).json({ error: 'Missing url' });

    const url = normalizeUrl(raw);
    const domain = pickDomain(url);

    const { text: html, res: response, ms } = await timeLimit(fetchText(url.toString(), { redirect: 'follow' }));
    const $ = cheerio.load(html);

    const seo = parseSEO($);
    const tech = detectTech(html, $);
    const tracking = detectTrackers($);

    const origin = `${url.protocol}//${url.host}`;
    const robots = await getRobotsAndSitemaps(origin);
    const rdap = await getRDAP(domain);
    const tranco = await getTrancoRank(domain);

    const recommendations = recommend(seo, tracking, robots);

    const payload = {
      input: { url: url.toString(), domain },
      response: { 
        status: response.status, 
        elapsedMs: ms, 
        server: response.headers.get('server'), 
        xPoweredBy: response.headers.get('x-powered-by') 
      },
      seo, 
      tech, 
      tracking, 
      robots,
      traffic: tranco.available ? { ...tranco } : { available: false },
      domain: rdap.available ? { ...rdap } : { available: false },
      recommendations,
      generatedAt: new Date().toISOString()
    };

    res.json(payload);
  } catch (e: any) {
    console.error('Competitor intel scan error:', e);
    res.status(500).json({ error: e?.message || 'Failed to scan' });
  }
});

export default router;