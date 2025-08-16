import express from 'express';
import os from 'node:os';
import { getBlogMetrics } from './blog-db';
import { log } from './logger';

export const statusRouter = express.Router();

statusRouter.get('/health', (_req, res) => {
  res.json({ 
    ok: true, 
    time: new Date().toISOString(),
    service: 'advanta-ai-blog'
  });
});

statusRouter.get('/metrics', (_req, res) => {
  try {
    const mem = process.memoryUsage();
    const blogMetrics = getBlogMetrics();
    
    res.json({
      uptime: process.uptime(),
      load: os.loadavg(),
      memory: {
        rss: mem.rss,
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
        external: mem.external
      },
      blog: blogMetrics,
      now: new Date().toISOString(),
    });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get metrics');
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

statusRouter.get('/ready', (_req, res) => {
  // Check if essential services are working
  try {
    getBlogMetrics(); // Test database connection
    res.json({ ready: true });
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Service not ready');
    res.status(503).json({ ready: false, error: 'Database unavailable' });
  }
});