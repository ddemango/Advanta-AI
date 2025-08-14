// First-party analytics service for tracking user interactions

import { db } from './db';
import { sql } from 'drizzle-orm';

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  tenantSlug?: string;
  userId?: number;
}

// Simple analytics table for first-party tracking
export async function createAnalyticsTable() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event VARCHAR(255) NOT NULL,
        properties JSONB NOT NULL,
        tenant_slug VARCHAR(100),
        user_id INTEGER,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON analytics_events(event);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant ON analytics_events(tenant_slug);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
    `);
    
    console.log('[Analytics] Analytics table created successfully');
  } catch (error) {
    console.error('[Analytics] Error creating analytics table:', error);
  }
}

// Track analytics event
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    await db.execute(sql`
      INSERT INTO analytics_events (event, properties, tenant_slug, user_id, ip_address, user_agent, created_at)
      VALUES (${event.event}, ${JSON.stringify(event.properties)}, ${event.tenantSlug}, ${event.userId}, ${event.ip}, ${event.userAgent}, ${event.timestamp})
    `);
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
}

// Get analytics summary for tenant
export async function getAnalyticsSummary(tenantSlug: string, days: number = 30): Promise<any> {
  try {
    const result = await db.execute(sql`
      SELECT 
        event,
        COUNT(*) as count,
        DATE_TRUNC('day', created_at) as date
      FROM analytics_events 
      WHERE tenant_slug = ${tenantSlug}
        AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY event, DATE_TRUNC('day', created_at)
      ORDER BY date DESC, count DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('[Analytics] Error getting analytics summary:', error);
    return [];
  }
}

// Initialize analytics on startup
createAnalyticsTable();