function computeScore(data) {
  const pillars = {
    traffic: scoreTraffic(data.traffic),
    performance: scorePerformance(data.performance),
    seo: scoreSEO(data.seo),
    tech: scoreTech(data.tech),
    structure: scoreStructure(data.robots),
    tracking: scoreTracking(data.tracking)
  };
  
  const total = Math.round(Object.values(pillars).reduce((sum, score) => sum + score, 0) / Object.keys(pillars).length);
  
  return { total, pillars };
}

function scoreTraffic(traffic) {
  if (!traffic.available || !traffic.trancoRank) return 20;
  
  // Higher rank (lower number) = better score
  if (traffic.trancoRank <= 1000) return 100;
  if (traffic.trancoRank <= 10000) return 85;
  if (traffic.trancoRank <= 100000) return 70;
  if (traffic.trancoRank <= 1000000) return 55;
  return 35;
}

function scorePerformance(performance) {
  let score = 50; // baseline
  
  if (performance.LCP) {
    if (performance.LCP <= 2.5) score += 20;
    else if (performance.LCP <= 4.0) score += 10;
    else score -= 10;
  }
  
  if (performance.INP) {
    if (performance.INP <= 200) score += 15;
    else if (performance.INP <= 500) score += 5;
    else score -= 10;
  }
  
  if (performance.CLS) {
    if (performance.CLS <= 0.1) score += 15;
    else if (performance.CLS <= 0.25) score += 5;
    else score -= 10;
  }
  
  return Math.max(0, Math.min(100, score));
}

function scoreSEO(seo) {
  let score = 0;
  
  // Title scoring
  if (seo.title) {
    if (seo.titleLength >= 30 && seo.titleLength <= 60) score += 15;
    else if (seo.titleLength >= 20 && seo.titleLength <= 70) score += 10;
    else score += 5;
  }
  
  // Meta description scoring
  if (seo.metaDescription) {
    if (seo.metaDescriptionLength >= 120 && seo.metaDescriptionLength <= 160) score += 15;
    else if (seo.metaDescriptionLength >= 100 && seo.metaDescriptionLength <= 180) score += 10;
    else score += 5;
  }
  
  // Headings structure
  if (seo.headings.h1 === 1) score += 10;
  else if (seo.headings.h1 > 1) score += 5;
  
  if (seo.headings.h2 > 0) score += 10;
  
  // Schema and social
  if (seo.openGraphCount >= 4) score += 10;
  if (seo.twitterTagCount >= 3) score += 5;
  if (seo.jsonLdBlocks > 0) score += 10;
  
  // Images with alt text
  if (seo.images && seo.images.total > 0) {
    const altRatio = seo.images.withAlt / seo.images.total;
    if (altRatio >= 0.9) score += 10;
    else if (altRatio >= 0.7) score += 7;
    else if (altRatio >= 0.5) score += 5;
  }
  
  // Canonical URL
  if (seo.canonical) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

function scoreTech(tech) {
  let score = 30; // baseline
  
  // Modern frameworks
  if (tech.frameworks.includes('React') || tech.frameworks.includes('Vue.js') || tech.frameworks.includes('Angular')) {
    score += 20;
  }
  
  if (tech.frameworks.includes('Next.js') || tech.frameworks.includes('Nuxt.js')) {
    score += 15;
  }
  
  // CMS presence
  if (tech.cms) score += 10;
  
  // Third-party integrations (indicates sophistication)
  if (tech.thirdParties.length >= 10) score += 20;
  else if (tech.thirdParties.length >= 5) score += 15;
  else if (tech.thirdParties.length >= 2) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

function scoreStructure(robots) {
  let score = 20; // baseline
  
  if (robots.robotsTxt.present) {
    score += 30;
    
    // Reasonable number of disallow rules (not too restrictive)
    if (robots.robotsTxt.disallowCount >= 1 && robots.robotsTxt.disallowCount <= 10) {
      score += 10;
    }
  }
  
  if (robots.sitemaps.length > 0) {
    score += 25;
    
    // Well-structured sitemaps
    const totalUrls = robots.sitemaps.reduce((sum, sitemap) => sum + sitemap.urlCount, 0);
    if (totalUrls >= 10) score += 15;
    else if (totalUrls >= 5) score += 10;
    else if (totalUrls >= 1) score += 5;
  }
  
  return Math.max(0, Math.min(100, score));
}

function scoreTracking(tracking) {
  let score = 20; // baseline
  
  // Analytics tools (essential for data-driven business)
  if (tracking.analytics.length > 0) score += 25;
  if (tracking.analytics.length >= 2) score += 10; // Multiple analytics tools
  
  // Tag management
  if (tracking.tagManagers.length > 0) score += 20;
  
  // Marketing sophistication
  if (tracking.socialPixels.length > 0) score += 15;
  if (tracking.ads.length > 0) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

module.exports = {
  computeScore,
  scoreTraffic,
  scorePerformance,
  scoreSEO,
  scoreTech,
  scoreStructure,
  scoreTracking
};