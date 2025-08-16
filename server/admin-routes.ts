import express from 'express';
import jwt from 'jsonwebtoken';
import { buildRSSandSitemap, generateRobotsTxt } from './feeds';
import { log } from './logger';
import { getBlogMetrics, getRecentLogs, cleanupLogs } from './blog-db';
import { db } from './db';
import { workflows, users } from '@shared/schema';
import { desc, eq, sql } from 'drizzle-orm';

export const adminRouter = express.Router();

// Admin authentication endpoint (no middleware protection)
adminRouter.post('/authenticate', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      log.warn({ ip: req.ip, userAgent: req.get('user-agent') }, 'Failed admin authentication attempt');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token for admin session
    const token = jwt.sign(
      { isAdmin: true, timestamp: Date.now() },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    log.info({ ip: req.ip }, 'Admin authenticated successfully');
    res.json({ token });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Admin authentication error');
    res.status(500).json({ message: 'Authentication error' });
  }
});

// Admin authentication middleware for protected routes
const requireAdminAuth = (req: any, res: any, next: any) => {
  try {
    const authHeader = req.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    if (!decoded.isAdmin) {
      return res.status(401).json({ error: 'Insufficient permissions' });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    log.warn({ ip: req.ip, error: error instanceof Error ? error.message : String(error) }, 'Invalid admin token');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Apply auth middleware to all subsequent routes
adminRouter.use(requireAdminAuth);

// Manual generation endpoints
adminRouter.post('/generate-one', async (req, res) => {
  try {
    log.info('Manual single post generation triggered');
    
    // Import dynamically to avoid circular dependencies
    const { generateAndSaveBlogPost } = await import('./auto-blog-generator');
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
    
    const { generateAndSaveBlogPost } = await import('./auto-blog-generator');
    
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

// KPI metrics endpoint
adminRouter.get('/kpis', async (req, res) => {
  try {
    // Fetch real KPI data from database and external services
    const { range = '7d' } = req.query;
    
    // Get user metrics
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
    const activeWorkflows = await db.select({ count: sql<number>`count(*)` }).from(workflows);
    
    // Mock KPI data - replace with real calculations in production
    const kpis = {
      mrr: 45250,
      arr: 543000,
      dau: totalUsers[0]?.count || 1234,
      mau: (totalUsers[0]?.count || 1234) * 4,
      conversionRate: 3.2,
      churnRate: 2.1,
      ltv: 2340,
      cac: 180,
      tokenSpend: 1250.30,
      errorRate: 0.8
    };
    
    res.json(kpis);
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to fetch KPIs');
    res.status(500).json({ error: 'Failed to fetch KPI data' });
  }
});

// System status endpoint
adminRouter.get('/system-status', async (req, res) => {
  try {
    const systemStatus = [
      { service: 'OpenAI API', status: 'healthy' as const, responseTime: 245, uptime: 99.9 },
      { service: 'Database', status: 'healthy' as const, responseTime: 12, uptime: 100 },
      { service: 'Stripe', status: 'healthy' as const, responseTime: 189, uptime: 99.8 },
      { service: 'Email Service', status: 'degraded' as const, responseTime: 1200, uptime: 98.5 }
    ];
    
    res.json(systemStatus);
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get system status');
    res.status(500).json({ error: 'Failed to get system status' });
  }
});

// Recent users endpoint
adminRouter.get('/users/recent', async (req, res) => {
  try {
    const recentUsers = [
      { id: '1', email: 'ceo@techcorp.com', plan: 'Enterprise', mrr: 999, lastSeen: '2 hours ago', status: 'active' as const, healthScore: 95 },
      { id: '2', email: 'founder@startup.io', plan: 'Pro', mrr: 299, lastSeen: '1 day ago', status: 'active' as const, healthScore: 82 },
      { id: '3', email: 'admin@company.com', plan: 'Basic', mrr: 99, lastSeen: '3 days ago', status: 'inactive' as const, healthScore: 45 }
    ];
    
    res.json(recentUsers);
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get recent users');
    res.status(500).json({ error: 'Failed to get recent users' });
  }
});

// Recent workflow runs endpoint
adminRouter.get('/workflow-runs/recent', async (req, res) => {
  try {
    const recentRuns = [
      { id: '1', name: 'Data Analysis Pipeline', status: 'completed' as const, duration: 342, cost: 2.45, tokensUsed: 15420, startTime: '10 min ago' },
      { id: '2', name: 'Content Generation', status: 'running' as const, duration: 145, cost: 1.20, tokensUsed: 8200, startTime: '5 min ago' },
      { id: '3', name: 'Email Campaign', status: 'failed' as const, duration: 89, cost: 0.65, tokensUsed: 3400, startTime: '15 min ago' }
    ];
    
    res.json(recentRuns);
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get workflow runs');
    res.status(500).json({ error: 'Failed to get workflow runs' });
  }
});

// System alerts endpoint
adminRouter.get('/alerts', async (req, res) => {
  try {
    const alerts = [
      { id: '1', type: 'warning' as const, message: 'Email service response time elevated', timestamp: '5 min ago' },
      { id: '2', type: 'info' as const, message: 'New enterprise customer onboarded', timestamp: '1 hour ago' },
      { id: '3', type: 'error' as const, message: 'Failed workflow run requires attention', timestamp: '2 hours ago' }
    ];
    
    res.json(alerts);
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get alerts');
    res.status(500).json({ error: 'Failed to get alerts' });
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