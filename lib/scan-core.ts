import * as cheerio from 'cheerio';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36';

export async function fetchPage(url: string) {
  const start = Date.now();
  const res = await fetch(url, { headers: { 'user-agent': UA }, cache: 'no-store', redirect: 'follow' });
  const html = await res.text();
  return { html, res, ms: Date.now() - start };
}

export function timeLimit<T>(p: Promise<T>, ms = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then(v => { clearTimeout(t); resolve(v); }).catch(e => { clearTimeout(t); reject(e); });
  });
}

export function parseSEO($: cheerio.CheerioAPI, html: string) {
  const title = $('title').first().text().trim() || '';
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
  const canonical = $('link[rel="canonical"]').attr('href') || null;
  const robotsMeta = $('meta[name="robots"]').attr('content') || null;
  const og = $('meta[property^="og:"]').length;
  const tw = $('meta[name^="twitter:"]').length;
  const jsonLdBlocks = $('script[type="application/ld+json"]').length;
  const headings = { h1: $('h1').length, h2: $('h2').length, h3: $('h3').length, h4: $('h4').length, h5: $('h5').length, h6: $('h6').length };
  const text = $('body').text().replace(/\s+/g, ' ');
  const wordCount = text ? text.trim().split(/\s+/).length : 0;
  const imgs = $('img').toArray();
  const withAlt = imgs.filter(i => !!($(i).attr('alt') || '').trim()).length;
  const links = $('a[href]').toArray().map(e => ($(e).attr('href') || '').trim());
  const internal = links.filter(h => h.startsWith('/') || h.startsWith('#') || (!/^https?:\/\//i.test(h))).length;
  const external = links.filter(h => /^https?:\/\//i.test(h)).length;

  return {
    title, titleLength: title.length,
    metaDescription, metaDescriptionLength: metaDescription.length,
    canonical, robotsMeta,
    openGraphCount: og, twitterTagCount: tw, jsonLdBlocks,
    headings, wordCount,
    images: { total: imgs.length, withAlt, withoutAlt: imgs.length - withAlt },
    links: { internal, external },
  };
}

export function detectTechAndTrackers($: cheerio.CheerioAPI, html: string) {
  const evidence: string[] = [];
  let cms: string | null = null;
  const frameworks: string[] = [];
  const thirdParties: string[] = [];

  if (html.includes('wp-content') || html.includes('wp-json')) { cms = 'WordPress'; evidence.push('wp-content'); }
  if (html.includes('cdn.shopify.com')) { cms = 'Shopify'; evidence.push('cdn.shopify.com'); }
  if (html.includes('__NEXT_DATA__') || $('script#__NEXT_DATA__').length) { frameworks.push('Next.js'); evidence.push('__NEXT_DATA__'); }
  if (html.includes('window.__NUXT__')) { frameworks.push('Nuxt'); evidence.push('__NUXT__'); }
  if (html.includes('data-reactroot') || html.includes('React.createElement')) { frameworks.push('React'); evidence.push('React'); }

  const srcs: string[] = []; const inlines: string[] = [];
  $('script').each((_, el) => {
    const src = $(el).attr('src'); if (src) srcs.push(src); else inlines.push($(el).text() || '');
  });
  const test = (re: RegExp) => srcs.some(s => re.test(s)) || inlines.some(c => re.test(c));

  const analytics: string[] = [];
  const ads: string[] = [];
  const tagManagers: string[] = [];
  const socialPixels: string[] = [];

  if (test(/googletagmanager\.com\/gtag\/js/i)) analytics.push('GA4 (gtag.js)');
  if (test(/www\.google-analytics\.com\/analytics\.js/i)) analytics.push('Universal Analytics');
  if (test(/static\.hotjar\.com|hotjar\.com\/c\//i)) analytics.push('Hotjar');
  if (test(/cdn\.segment\.com\/analytics\.js/i)) analytics.push('Segment');
  if (test(/mixpanel\.com/i)) analytics.push('Mixpanel');

  if (test(/doubleclick\.net|googlesyndication\.com|googletagservices\.com/i)) ads.push('Google Ads / DoubleClick');
  if (test(/taboola\.com|outbrain\.com/i)) ads.push('Native Ads (Taboola/Outbrain)');
  if (test(/snap\.sc\/static\/pixie/i)) socialPixels.push('Snap Pixel');
  if (test(/connect\.facebook\.net\/.+\/fbevents\.js/i)) socialPixels.push('Meta Pixel');
  if (test(/ads-twitter\.com\/uwt\.js/i)) socialPixels.push('Twitter Pixel');
  if (test(/tiktok\.com\/i18n\/pixel/i)) socialPixels.push('TikTok Pixel');

  if (test(/gtm\.js|googletagmanager\.com/i)) tagManagers.push('Google Tag Manager');

  return { tech: { cms, frameworks, evidence, thirdParties }, tracking: { analytics, ads, tagManagers, socialPixels } };
}

export async function parseRobotsAndSitemaps(url: URL) {
  const robotsUrl = `${url.protocol}//${url.host}/robots.txt`;
  try {
    const res = await fetch(robotsUrl, { cache: 'no-store' });
    if (!res.ok) return { robotsTxt: { present: false, disallowCount: 0, sitemaps: [] }, sitemaps: [] };
    const txt = await res.text();
    const lines = txt.split('\n');
    const disallowCount = lines.filter(l => /^disallow:/i.test(l)).length;
    const sitemaps = lines.filter(l => /^sitemap:/i.test(l)).map(l => l.split(':').slice(1).join(':').trim()).filter(Boolean);

    const sitemapSummaries: { url: string; urlCount: number }[] = [];
    for (const sm of sitemaps.slice(0, 3)) {
      try {
        const xml = await (await fetch(sm, { cache: 'no-store' })).text();
        const count = (xml.match(/<loc>/g) || []).length;
        sitemapSummaries.push({ url: sm, urlCount: count });
      } catch {}
    }
    return { robotsTxt: { present: true, disallowCount, sitemaps }, sitemaps: sitemapSummaries };
  } catch { return { robotsTxt: { present: false, disallowCount: 0, sitemaps: [] }, sitemaps: [] }; }
}

export function estimatePerf(html: string, $: cheerio.CheerioAPI) {
  const weightKB = Math.round(Buffer.byteLength(html, 'utf8') / 1024);
  const reqImages = $('img').length;
  const reqScripts = $('script[src]').length + $('link[rel="stylesheet"]').length;
  return { weightKB, reqImages, reqScripts, passed: undefined, LCP: undefined, INP: undefined, CLS: undefined };
}