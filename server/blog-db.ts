import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { log } from './logger';

const DB_PATH = path.join(process.cwd(), 'data', 'blog.sqlite');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const blogDb = new Database(DB_PATH);

// Initialize database with optimized settings
blogDb.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  PRAGMA temp_store = memory;
  PRAGMA mmap_size = 268435456;
  
  CREATE TABLE IF NOT EXISTS views (
    slug TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0,
    lastViewed TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS blog_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    createdAt TEXT NOT NULL,
    verified INTEGER NOT NULL DEFAULT 1,
    source TEXT DEFAULT 'blog'
  );
  
  CREATE TABLE IF NOT EXISTS generation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT,
    timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT
  );
  
  CREATE TABLE IF NOT EXISTS api_usage (
    date TEXT PRIMARY KEY,
    requests INTEGER NOT NULL DEFAULT 0,
    tokens INTEGER NOT NULL DEFAULT 0
  );
  
  CREATE INDEX IF NOT EXISTS idx_sub_email ON blog_subscribers(email);
  CREATE INDEX IF NOT EXISTS idx_views_slug ON views(slug);
  CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON generation_logs(timestamp);
  CREATE INDEX IF NOT EXISTS idx_logs_type ON generation_logs(type);
`);

// Helper functions for view tracking
export function getViews(slug: string): number {
  try {
    const row = blogDb.prepare('SELECT count FROM views WHERE slug=?').get(slug) as { count: number } | undefined;
    return row?.count ?? 0;
  } catch (error: any) {
    log.error({ error: error?.message || String(error), slug }, 'Failed to get view count');
    return 0;
  }
}

export function incView(slug: string): number {
  try {
    blogDb.prepare(`
      INSERT INTO views(slug, count, lastViewed) 
      VALUES(?, 1, CURRENT_TIMESTAMP) 
      ON CONFLICT(slug) DO UPDATE SET 
        count = count + 1,
        lastViewed = CURRENT_TIMESTAMP
    `).run(slug);
    return getViews(slug);
  } catch (error: any) {
    log.error({ error: error?.message || String(error), slug }, 'Failed to increment view count');
    return getViews(slug);
  }
}

// Helper functions for logging
export function logGeneration(type: string, status: 'start' | 'success' | 'error', message?: string, metadata?: any) {
  try {
    blogDb.prepare(`
      INSERT INTO generation_logs(type, status, message, metadata) 
      VALUES(?, ?, ?, ?)
    `).run(type, status, message || null, metadata ? JSON.stringify(metadata) : null);
  } catch (error: any) {
    log.error({ error: error?.message || String(error), type, status }, 'Failed to log generation event');
  }
}

// Helper functions for API usage tracking
export function trackAPIUsage(tokens: number) {
  try {
    const date = new Date().toISOString().split('T')[0];
    blogDb.prepare(`
      INSERT INTO api_usage(date, requests, tokens) 
      VALUES(?, 1, ?) 
      ON CONFLICT(date) DO UPDATE SET 
        requests = requests + 1,
        tokens = tokens + ?
    `).run(date, tokens, tokens);
  } catch (error: any) {
    log.error({ error: error?.message || String(error), tokens }, 'Failed to track API usage');
  }
}

export function getAPIUsage(days: number = 30) {
  try {
    return blogDb.prepare(`
      SELECT * FROM api_usage 
      WHERE date >= date('now', '-' || ? || ' days')
      ORDER BY date DESC
    `).all(days);
  } catch (error: any) {
    log.error({ error: error?.message || String(error), days }, 'Failed to get API usage');
    return [];
  }
}

export function getRecentLogs(limit: number = 100) {
  try {
    return blogDb.prepare(`
      SELECT * FROM generation_logs 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(limit);
  } catch (error: any) {
    log.error({ error: error?.message || String(error), limit }, 'Failed to get recent logs');
    return [];
  }
}

// Cleanup old logs (keep last 1000 entries)
export function cleanupLogs() {
  try {
    const result = blogDb.prepare(`
      DELETE FROM generation_logs 
      WHERE id NOT IN (
        SELECT id FROM generation_logs 
        ORDER BY timestamp DESC 
        LIMIT 1000
      )
    `).run();
    log.info({ deletedRows: result.changes }, 'Cleaned up old generation logs');
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to cleanup logs');
  }
}

// Get blog metrics
export function getBlogMetrics() {
  try {
    const totalViews = blogDb.prepare('SELECT SUM(count) as total FROM views').get() as { total: number } | undefined;
    const uniquePages = blogDb.prepare('SELECT COUNT(*) as count FROM views').get() as { count: number } | undefined;
    const subscribers = blogDb.prepare('SELECT COUNT(*) as count FROM blog_subscribers WHERE verified = 1').get() as { count: number } | undefined;
    const todayUsage = blogDb.prepare('SELECT * FROM api_usage WHERE date = date("now")').get() as { requests: number, tokens: number } | undefined;
    
    return {
      totalViews: totalViews?.total || 0,
      uniquePages: uniquePages?.count || 0,
      subscribers: subscribers?.count || 0,
      todayRequests: todayUsage?.requests || 0,
      todayTokens: todayUsage?.tokens || 0
    };
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to get blog metrics');
    return {
      totalViews: 0,
      uniquePages: 0,
      subscribers: 0,
      todayRequests: 0,
      todayTokens: 0
    };
  }
}