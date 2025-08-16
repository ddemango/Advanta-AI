import path from 'node:path';
import fs from 'node:fs/promises';
import { log, blogLog } from './logger';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags?: string[];
  filename?: string;
}

// Build index from file-based blog posts
async function buildIndex(): Promise<BlogPost[]> {
  try {
    const postsDir = path.join(process.cwd(), 'posts');
    const exists = await fs.access(postsDir).then(() => true).catch(() => false);
    if (!exists) return [];

    const files = await fs.readdir(postsDir);
    const posts: BlogPost[] = [];

    for (const file of files) {
      if (file.endsWith('.html')) {
        try {
          const filepath = path.join(postsDir, file);
          const content = await fs.readFile(filepath, 'utf-8');
          
          // Extract metadata from HTML
          const titleMatch = content.match(/<title>(.*?)\|/);
          const categoryMatch = content.match(/meta name="category" content="([^"]+)"/);
          const dateMatch = content.match(/meta name="date" content="([^"]+)"/);
          const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
          const tagsMatch = content.match(/<meta name="tags" content="([^"]+)"/);
          
          if (titleMatch) {
            const slug = file.replace('.html', '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
            const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean) : [];
            
            posts.push({
              filename: file,
              title: titleMatch[1].trim(),
              slug,
              category: categoryMatch ? categoryMatch[1] : 'ai_technology',
              date: dateMatch ? dateMatch[1] : file.substring(0, 10),
              description: descMatch ? descMatch[1] : `${titleMatch[1].trim().substring(0, 120)}...`,
              tags
            });
          }
        } catch (error: any) {
          log.error({ error: error?.message || String(error), file }, 'Failed to parse blog post');
        }
      }
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to build blog index');
    return [];
  }
}

export async function buildRSSandSitemap(): Promise<void> {
  blogLog.feeds.start();
  
  try {
    const posts = await buildIndex();
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    // RSS (top 50)
    const top = posts.slice(0, 50);
    const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : 'https://advanta-ai.com';

    const rssItems = top.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <guid>${baseUrl}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
      <category>${p.category}</category>
      ${p.tags ? p.tags.map(tag => `<category domain="tag">${tag}</category>`).join('\n      ') : ''}
    </item>`).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Advanta AI Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Latest AI insights, automation strategies, and business intelligence from Advanta AI</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

    await fs.writeFile(path.join(PUBLIC_DIR, 'rss.xml'), rss, 'utf8');

    // Sitemap (top 1000)
    const sitemapPosts = posts.slice(0, 1000);
    const urls = [
      `<url><loc>${baseUrl}/</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod><priority>1.0</priority></url>`,
      `<url><loc>${baseUrl}/blog</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod><priority>0.9</priority></url>`,
      ...sitemapPosts.map(p => `
    <url>
      <loc>${baseUrl}/blog/${p.slug}</loc>
      <lastmod>${p.date}</lastmod>
      <priority>0.7</priority>
    </url>`)
    ].join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

    await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf8');

    blogLog.feeds.success(posts.length);
    log.info({ postCount: posts.length, rssItems: top.length, sitemapUrls: sitemapPosts.length }, 'RSS and sitemap generated successfully');
  } catch (error: any) {
    blogLog.feeds.error(error);
    throw error;
  }
}

// Generate robots.txt
export async function generateRobotsTxt(): Promise<void> {
  try {
    const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : 'https://advanta-ai.com';

    const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Block access to admin areas
Disallow: /admin/
Disallow: /api/admin/

# Block access to private files
Disallow: /data/
Disallow: /*.sqlite$
`;

    await fs.writeFile(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8');
    log.info('Robots.txt generated successfully');
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to generate robots.txt');
  }
}