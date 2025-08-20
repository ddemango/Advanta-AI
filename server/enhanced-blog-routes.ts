import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import Fuse from 'fuse.js';
import sanitizeHtml from 'sanitize-html';
import { getViews, incView } from './blog-db';
import { log, blogLog } from './logger';

export const blogRouter = express.Router();

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  filename: string;
  viewCount: number;
  readingTime: number;
}

// Enhanced function to extract metadata including tags and reading time
function extractEnhancedMeta(html: string, filename: string): BlogPost | null {
  try {
    const titleMatch = html.match(/<title>(.*?)\|/);
    const categoryMatch = html.match(/meta name="category" content="([^"]+)"/);
    const dateMatch = html.match(/meta name="date" content="([^"]+)"/);
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const tagsMatch = html.match(/<meta name="tags" content="([^"]+)"/);
    
    if (!titleMatch) return null;

    let slug = filename.replace('.html', '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    // If slug is empty after removing date prefix, generate from title
    if (!slug) {
      slug = titleMatch[1].toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .replace(/\*+/g, '') // Remove asterisks
        .substring(0, 60);
    }
    const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean) : [];
    
    // Calculate reading time (average 200 words per minute)
    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    return {
      filename,
      title: titleMatch[1].trim(),
      slug,
      category: categoryMatch ? categoryMatch[1] : 'ai_technology',
      date: dateMatch ? dateMatch[1] : filename.substring(0, 10),
      description: descMatch ? descMatch[1] : `${titleMatch[1].trim().substring(0, 120)}...`,
      tags,
      viewCount: getViews(slug),
      readingTime
    };
  } catch (error: any) {
    log.error({ error: error?.message || String(error), filename }, 'Failed to extract enhanced metadata');
    return null;
  }
}

// Build enhanced index with all metadata - exported for compatibility
export async function buildEnhancedIndex(): Promise<BlogPost[]> {
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
          const meta = extractEnhancedMeta(content, file);
          if (meta) posts.push(meta);
        } catch (error: any) {
          log.error({ error: error?.message || String(error), file }, 'Failed to process blog file');
        }
      }
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to build enhanced index');
    return [];
  }
}

// Enhanced posts endpoint with search, filtering, and pagination
blogRouter.get('/posts', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { 
      q = '', 
      category = '', 
      tag = '', 
      cursor = '', 
      limit = '12' 
    } = req.query as Record<string, string>;
    
    const cap = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);

    let items = await buildEnhancedIndex();

    // Apply filters
    if (category && category !== 'all') {
      items = items.filter(i => i.category === category);
    }
    
    if (tag) {
      items = items.filter(i => i.tags.includes(tag));
    }

    // Apply search using Fuse.js for fuzzy search
    if (q) {
      const fuse = new Fuse(items, { 
        keys: ['title', 'description', 'slug', 'category', 'tags'], 
        threshold: 0.35, 
        includeScore: false 
      });
      items = fuse.search(q).map(r => r.item);
    }

    // Apply cursor pagination
    let start = 0;
    if (cursor) {
      const idx = items.findIndex(i => `${i.date}|${i.filename}` === cursor);
      start = idx >= 0 ? idx + 1 : 0;
    }
    
    const page = items.slice(start, start + cap);
    const nextCursor = page.length === cap ? `${page[page.length-1].date}|${page[page.length-1].filename}` : null;

    // Get available categories and tags for filtering
    const allItems = items.length === 0 ? await buildEnhancedIndex() : items;
    const categories = Array.from(new Set(allItems.map(i => i.category))).sort();
    const tags = Array.from(new Set(allItems.flatMap(i => i.tags))).sort();

    const duration = Date.now() - startTime;
    if (duration > 1000) {
      blogLog.api.slowQuery('/api/blog/posts', duration);
    }

    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.json({ 
      items: page, 
      nextCursor,
      total: items.length,
      categories,
      tags,
      meta: {
        query: q,
        category,
        tag,
        limit: cap,
        hasMore: !!nextCursor
      }
    });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get enhanced blog posts');
    res.status(500).json({ error: 'Failed to build index' });
  }
});

// Get blog system status - MUST BE BEFORE parameterized routes
blogRouter.get('/status', async (req, res) => {
  try {
    // Import automatedScheduler dynamically to avoid circular dependencies
    const { automatedScheduler } = await import('./automated-scheduler');
    const status = automatedScheduler.getStatus();
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.json(status);
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get blog status');
    res.status(500).json({ error: 'Failed to get blog status' });
  }
});

// Enhanced single post endpoint
blogRouter.get('/file/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const postsDir = path.join(process.cwd(), 'posts');
    const files = await fs.readdir(postsDir);
    
    // Find file by slug
    const file = files.find(f => {
      const fileSlug = f.replace('.html', '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
      return fileSlug === slug;
    });

    if (!file) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const filepath = path.join(postsDir, file);
    const content = await fs.readFile(filepath, 'utf-8');
    const meta = extractEnhancedMeta(content, file);

    if (!meta) {
      return res.status(500).json({ error: 'Failed to parse post metadata' });
    }

    // Sanitize content for safe rendering
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h2','h3','img','figure','figcaption']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src','alt','title','loading','width','height'],
        a: ['href','name','target','rel'],
      },
      transformTags: {
        a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
        img: sanitizeHtml.simpleTransform('img', { loading: 'lazy' }),
      },
    });

    res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.json({
      ...meta,
      content: sanitizedContent
    });
  } catch (error: any) {
    log.error({ error: error?.message || String(error), slug: req.params.slug }, 'Failed to get blog post');
    res.status(500).json({ error: 'Failed to load post' });
  }
});

// View tracking endpoint
blogRouter.post('/view/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const newCount = incView(slug);
    
    res.json({ 
      slug, 
      viewCount: newCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    log.error({ error: error?.message || String(error), slug: req.params.slug }, 'Failed to track view');
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Get popular posts
blogRouter.get('/popular', async (req, res) => {
  try {
    const { limit = '10' } = req.query as Record<string, string>;
    const cap = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    
    const posts = await buildEnhancedIndex();
    const popular = posts
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, cap);

    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.json({ items: popular });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get popular posts');
    res.status(500).json({ error: 'Failed to get popular posts' });
  }
});

