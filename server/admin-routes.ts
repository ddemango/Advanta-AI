import express from 'express';
import { buildRSSandSitemap, generateRobotsTxt } from './feeds';
import { log } from './logger';
import { getBlogMetrics, getRecentLogs, cleanupLogs } from './blog-db';

export const adminRouter = express.Router();

// Admin authentication middleware
adminRouter.use((req, res, next) => {
  const adminKey = req.get('x-admin-key') || req.query.key as string;
  if (adminKey !== process.env.ADMIN_KEY) {
    log.warn({ ip: req.ip, userAgent: req.get('user-agent') }, 'Unauthorized admin access attempt');
    return res.status(401).json({ error: 'Unauthorized - Invalid admin key' });
  }
  next();
});

// Manual generation endpoints
adminRouter.post('/generate-one', async (req, res) => {
  try {
    log.info('Manual single post generation triggered');
    
    // Import dynamically to avoid circular dependencies
    const { generateAndSaveBlogPost } = await import('./daily-blog-system');
    await generateAndSaveBlogPost();
    
    res.json({ 
      ok: true, 
      message: 'Single blog post generated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Manual generation failed');
    res.status(500).json({ 
      error: 'Generation failed', 
      message: error?.message || String(error)
    });
  }
});

adminRouter.post('/generate-three', async (req, res) => {
  try {
    log.info('Manual three posts generation triggered');
    
    const { generateAndSaveBlogPost } = await import('./daily-blog-system');
    
    // Generate 3 posts in parallel
    await Promise.all([
      generateAndSaveBlogPost(),
      generateAndSaveBlogPost(),
      generateAndSaveBlogPost()
    ]);
    
    res.json({ 
      ok: true, 
      message: 'Three blog posts generated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Manual generation failed');
    res.status(500).json({ 
      error: 'Generation failed', 
      message: error?.message || String(error)
    });
  }
});

// Newsletter management
adminRouter.post('/newsletter/send', async (req, res) => {
  try {
    log.info('Manual newsletter send triggered');
    
    const { sendDailyNewsletter } = await import('./newsletter-system');
    await sendDailyNewsletter();
    
    res.json({ 
      ok: true, 
      message: 'Newsletter sent successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Manual newsletter send failed');
    res.status(500).json({ 
      error: 'Newsletter send failed', 
      message: error?.message || String(error)
    });
  }
});

// RSS and sitemap management
adminRouter.post('/feeds/generate', async (req, res) => {
  try {
    log.info('Manual RSS and sitemap generation triggered');
    
    await buildRSSandSitemap();
    await generateRobotsTxt();
    
    res.json({ 
      ok: true, 
      message: 'RSS, sitemap, and robots.txt generated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Manual feed generation failed');
    res.status(500).json({ 
      error: 'Feed generation failed', 
      message: error?.message || String(error)
    });
  }
});

// System status and metrics
adminRouter.get('/status', (req, res) => {
  try {
    const metrics = getBlogMetrics();
    const recentLogs = getRecentLogs(20);
    
    res.json({
      metrics,
      recentLogs,
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get admin status');
    res.status(500).json({ 
      error: 'Failed to get status', 
      message: error?.message || String(error)
    });
  }
});

// Log management
adminRouter.get('/logs', (req, res) => {
  try {
    const { limit = '100' } = req.query as Record<string, string>;
    const cap = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 1000);
    
    const logs = getRecentLogs(cap);
    res.json({ logs, total: logs.length });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get logs');
    res.status(500).json({ 
      error: 'Failed to get logs', 
      message: error?.message || String(error)
    });
  }
});

adminRouter.post('/logs/cleanup', (req, res) => {
  try {
    cleanupLogs();
    log.info('Log cleanup triggered manually');
    
    res.json({ 
      ok: true, 
      message: 'Logs cleaned up successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to cleanup logs');
    res.status(500).json({ 
      error: 'Cleanup failed', 
      message: error?.message || String(error)
    });
  }
});

// Health check endpoint
adminRouter.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    service: 'advanta-ai-admin',
    timestamp: new Date().toISOString()
  });
});