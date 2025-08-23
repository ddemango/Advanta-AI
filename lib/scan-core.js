const cheerio = require('cheerio');

async function fetchPage(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    clearTimeout(timeoutId);
    const html = await res.text();
    const size = Buffer.byteLength(html, 'utf8');
    
    return { 
      html, 
      res: { 
        status: res.status, 
        headers: res.headers,
        size 
      } 
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function timeLimit(promise, ms) {
  const start = Date.now();
  try {
    const result = await promise;
    return { ...result, ms: Date.now() - start };
  } catch (error) {
    throw { ...error, ms: Date.now() - start };
  }
}

function parseSEO($, html) {
  const title = $('title').text() || '';
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || null;
  const robotsMeta = $('meta[name="robots"]').attr('content') || null;
  
  const openGraphCount = $('meta[property^="og:"]').length;
  const twitterTagCount = $('meta[name^="twitter:"]').length;
  const jsonLdBlocks = $('script[type="application/ld+json"]').length;
  
  const headings = {
    h1: $('h1').length,
    h2: $('h2').length,
    h3: $('h3').length,
    h4: $('h4').length,
    h5: $('h5').length,
    h6: $('h6').length
  };
  
  const images = {
    total: $('img').length,
    withAlt: $('img[alt]').length,
    withoutAlt: $('img:not([alt])').length
  };
  
  const links = {
    internal: $('a[href^="/"], a[href*="' + new URL($('base').attr('href') || 'http://example.com').hostname + '"]').length,
    external: $('a[href^="http"]:not([href*="' + new URL($('base').attr('href') || 'http://example.com').hostname + '"])').length
  };
  
  const wordCount = $('body').text().split(/\s+/).filter(word => word.length > 0).length;
  
  return {
    title,
    titleLength: title.length,
    metaDescription,
    metaDescriptionLength: metaDescription.length,
    canonical,
    robotsMeta,
    openGraphCount,
    twitterTagCount,
    jsonLdBlocks,
    headings,
    wordCount,
    images,
    links
  };
}

function detectTechAndTrackers($, html) {
  const tech = {
    cms: null,
    frameworks: [],
    evidence: [],
    thirdParties: []
  };
  
  const tracking = {
    analytics: [],
    ads: [],
    tagManagers: [],
    socialPixels: [],
    consentMode: false
  };
  
  // CMS Detection
  if (html.includes('wp-content') || html.includes('wordpress')) {
    tech.cms = 'WordPress';
    tech.evidence.push('wp-content');
  } else if (html.includes('drupal')) {
    tech.cms = 'Drupal';
    tech.evidence.push('drupal');
  } else if (html.includes('joomla')) {
    tech.cms = 'Joomla';
    tech.evidence.push('joomla');
  }
  
  // Framework Detection
  if (html.includes('react') || $('[data-reactroot]').length > 0) {
    tech.frameworks.push('React');
  }
  if (html.includes('vue.js') || html.includes('__vue__')) {
    tech.frameworks.push('Vue.js');
  }
  if (html.includes('angular') || $('[ng-app]').length > 0) {
    tech.frameworks.push('Angular');
  }
  if (html.includes('next.js') || html.includes('_next/')) {
    tech.frameworks.push('Next.js');
  }
  
  // Analytics Detection
  if (html.includes('google-analytics') || html.includes('gtag') || html.includes('UA-')) {
    tracking.analytics.push('Google Analytics');
  }
  if (html.includes('googletagmanager')) {
    tracking.tagManagers.push('Google Tag Manager');
  }
  if (html.includes('hotjar')) {
    tracking.analytics.push('Hotjar');
  }
  if (html.includes('mixpanel')) {
    tracking.analytics.push('Mixpanel');
  }
  
  // Advertising Detection
  if (html.includes('googlesyndication') || html.includes('adsystem')) {
    tracking.ads.push('Google Ads');
  }
  if (html.includes('facebook.com/tr')) {
    tracking.socialPixels.push('Facebook Pixel');
  }
  if (html.includes('linkedin.com/insight')) {
    tracking.socialPixels.push('LinkedIn Insight Tag');
  }
  
  // Third-party Services
  const services = [
    'stripe.com', 'paypal.com', 'shopify', 'woocommerce',
    'cloudflare', 'amazonaws.com', 'googletagmanager',
    'youtube.com', 'vimeo.com', 'typeform', 'calendly',
    'intercom', 'zendesk', 'hubspot', 'mailchimp'
  ];
  
  services.forEach(service => {
    if (html.includes(service)) {
      tech.thirdParties.push(service);
    }
  });
  
  return { tech, tracking };
}

async function parseRobotsAndSitemaps(url) {
  const domain = url.origin;
  const robotsUrl = `${domain}/robots.txt`;
  const sitemaps = [];
  
  let robotsTxt = {
    present: false,
    disallowCount: 0,
    sitemaps: []
  };
  
  try {
    const robotsRes = await fetch(robotsUrl);
    if (robotsRes.ok) {
      const robotsContent = await robotsRes.text();
      robotsTxt.present = true;
      robotsTxt.disallowCount = (robotsContent.match(/Disallow:/gi) || []).length;
      
      // Extract sitemaps from robots.txt
      const sitemapMatches = robotsContent.match(/Sitemap:\s*(.*)/gi) || [];
      robotsTxt.sitemaps = sitemapMatches.map(match => match.replace(/Sitemap:\s*/i, '').trim());
      
      // Try to fetch sitemap URLs and count entries
      for (const sitemapUrl of robotsTxt.sitemaps.slice(0, 3)) { // Limit to 3 sitemaps
        try {
          const sitemapRes = await fetch(sitemapUrl);
          if (sitemapRes.ok) {
            const sitemapContent = await sitemapRes.text();
            const urlCount = (sitemapContent.match(/<loc>/g) || []).length;
            sitemaps.push({ url: sitemapUrl, urlCount });
          }
        } catch (e) {
          // Skip failed sitemaps
        }
      }
    }
  } catch (e) {
    // Robots.txt not accessible
  }
  
  return { robotsTxt, sitemaps };
}

function estimatePerf(html, $) {
  const weightKB = Math.round(Buffer.byteLength(html, 'utf8') / 1024);
  const reqImages = $('img').length;
  const reqScripts = $('script[src]').length;
  
  // Rough estimates for Core Web Vitals based on page size and complexity
  const LCP = Math.max(1.0, Math.min(4.0, weightKB / 100 + reqImages * 0.1));
  const INP = Math.max(100, Math.min(500, reqScripts * 20 + weightKB * 0.5));
  const CLS = Math.max(0.0, Math.min(0.25, reqImages * 0.01));
  
  const passed = LCP <= 2.5 && INP <= 200 && CLS <= 0.1;
  
  return { weightKB, reqImages, reqScripts, LCP, INP, CLS, passed };
}

module.exports = {
  fetchPage,
  timeLimit,
  parseSEO,
  detectTechAndTrackers,
  parseRobotsAndSitemaps,
  estimatePerf
};