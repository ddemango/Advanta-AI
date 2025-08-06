// Sitemap generation utility
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const sitemapUrls: SitemapUrl[] = [
  // Main pages
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/services', changefreq: 'weekly', priority: 0.9 },
  { loc: '/services/ai-workflow-automation', changefreq: 'weekly', priority: 0.8 },
  { loc: '/services/website-ai-assistants', changefreq: 'weekly', priority: 0.8 },
  { loc: '/services/api-integrations', changefreq: 'weekly', priority: 0.8 },
  { loc: '/services/industry-specific-ai', changefreq: 'weekly', priority: 0.8 },
  { loc: '/case-studies', changefreq: 'weekly', priority: 0.8 },
  { loc: '/blog', changefreq: 'daily', priority: 0.8 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
  { loc: '/roi-calculator', changefreq: 'monthly', priority: 0.7 },
  
  // Legal pages
  { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
  
  // Tools and resources
  { loc: '/free-tools', changefreq: 'weekly', priority: 0.6 },
  { loc: '/resources', changefreq: 'weekly', priority: 0.6 },
  { loc: '/marketplace', changefreq: 'weekly', priority: 0.5 },
];

export function generateSitemapXml(baseUrl: string = 'https://advanta-ai.com'): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
}

export function generateRobotsTxt(baseUrl: string = 'https://advanta-ai.com'): string {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Common crawl delays
Crawl-delay: 1

# Block sensitive areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /sandbox/
`;
}