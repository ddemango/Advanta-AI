import * as cron from 'node-cron';
import { generateEnhancedBlogPost } from './enhanced-daily-blog';
import { sendEnhancedDailyNewsletter } from './enhanced-newsletter';
import { buildRSSandSitemap, generateRobotsTxt } from './feeds';
import { cleanupLogs } from './blog-db';
import { log, blogLog, withRetry } from './logger';

export class AutomatedBlogScheduler {
  private tasks: cron.ScheduledTask[] = [];
  private isRunning = false;

  // Start all automated tasks
  start(): void {
    if (this.isRunning) {
      log.warn('Automated scheduler already running');
      return;
    }

    try {
      this.scheduleEnhancedBlogPosts();
      this.scheduleNewsletterSending();
      this.scheduleFeedGeneration();
      this.scheduleMaintenance();
      
      this.isRunning = true;
      log.info('🚀 Automated blog scheduler started successfully');
      
      // Generate initial RSS and sitemap
      this.generateFeedsNow().catch(error => {
        log.error({ error: error?.message || String(error) }, 'Initial feeds generation failed');
      });
      
    } catch (error: any) {
      log.error({ error: error?.message || String(error) }, 'Failed to start automated scheduler');
      throw error;
    }
  }

  // Stop all automated tasks
  stop(): void {
    this.tasks.forEach(task => task.destroy());
    this.tasks = [];
    this.isRunning = false;
    log.info('🛑 Automated scheduler stopped');
  }

  // Schedule enhanced blog post generation (3 times daily)
  private scheduleEnhancedBlogPosts(): void {
    const TZ = 'America/New_York';
    const POSTS_CRONS = ['0 8 * * *','0 13 * * *','0 18 * * *']; // 8am, 1pm, 6pm
    
    POSTS_CRONS.forEach((cronExpr, index) => {
      const taskName = ['morning', 'afternoon', 'evening'][index];
      const task = cron.schedule(cronExpr, async () => {
        await this.executeWithRetry(`${taskName}-blog`, generateEnhancedBlogPost);
      }, { 
        scheduled: true, 
        timezone: TZ,
        name: `${taskName}-blog-generation`
      });
      this.tasks.push(task);
    });
    
    const nextRuns = [
      this.getNextRun(8),
      this.getNextRun(13), 
      this.getNextRun(18)
    ];
    
    log.info({ 
      timezone: TZ,
      nextRuns: nextRuns.map(r => r.toLocaleString())
    }, '📝 Blog generation scheduled 3x daily');
  }

  // Schedule newsletter sending (Monday, Wednesday, Friday at 8:00 AM)
  private scheduleNewsletterSending(): void {
    const TZ = 'America/New_York';
    const NEWSLETTER_CRON = '0 8 * * 1,3,5'; // Mon/Wed/Fri 8am
    
    const newsletterTask = cron.schedule(NEWSLETTER_CRON, async () => {
      await this.executeWithRetry('newsletter', sendEnhancedDailyNewsletter);
    }, { 
      scheduled: true, 
      timezone: TZ,
      name: 'newsletter-sending'
    });

    this.tasks.push(newsletterTask);
    
    log.info({ timezone: TZ }, '📧 Newsletter scheduled for Mon/Wed/Fri at 8:00 AM');
  }

  // Schedule RSS and sitemap generation
  private scheduleFeedGeneration(): void {
    const TZ = 'America/New_York';
    
    // After each blog generation (with delay)
    const feedUpdateTask = cron.schedule('5 8,13,18 * * *', async () => {
      await this.executeWithRetry('feeds-update', async () => {
        await buildRSSandSitemap();
        await generateRobotsTxt();
      });
    }, { 
      scheduled: true, 
      timezone: TZ,
      name: 'feeds-generation'
    });

    // Daily comprehensive rebuild at 2:00 AM
    const dailyRebuildTask = cron.schedule('0 2 * * *', async () => {
      await this.executeWithRetry('daily-feeds-rebuild', async () => {
        await buildRSSandSitemap();
        await generateRobotsTxt();
      });
    }, { 
      scheduled: true, 
      timezone: TZ,
      name: 'daily-feeds-rebuild'
    });

    this.tasks.push(feedUpdateTask, dailyRebuildTask);
    
    log.info({ timezone: TZ }, '🔄 RSS/Sitemap generation scheduled');
  }

  // Schedule maintenance tasks
  private scheduleMaintenance(): void {
    const TZ = 'America/New_York';
    
    // Weekly log cleanup (Sunday at 3:00 AM)
    const logCleanupTask = cron.schedule('0 3 * * 0', async () => {
      await this.executeWithRetry('log-cleanup', cleanupLogs);
    }, { 
      scheduled: true, 
      timezone: TZ,
      name: 'log-cleanup'
    });

    this.tasks.push(logCleanupTask);
    
    log.info({ timezone: TZ }, '🧹 Maintenance tasks scheduled');
  }

  // Execute task with retry logic and proper logging
  private async executeWithRetry(taskName: string, fn: () => Promise<void>): Promise<void> {
    try {
      log.info({ task: taskName }, `Starting scheduled task: ${taskName}`);
      
      await withRetry(fn, taskName, 3);
      
      log.info({ task: taskName }, `Completed scheduled task: ${taskName}`);
    } catch (error: any) {
      log.error({ 
        task: taskName, 
        error: error?.message || String(error) 
      }, `Scheduled task failed: ${taskName}`);
      
      // Don't throw - we want the scheduler to continue running
    }
  }

  // Manual blog generation
  async generateBlogNow(): Promise<void> {
    log.info('Manual blog generation triggered');
    await generateEnhancedBlogPost();
  }

  // Manual newsletter sending
  async sendNewsletterNow(): Promise<void> {
    log.info('Manual newsletter send triggered');
    await sendEnhancedDailyNewsletter();
  }

  // Manual feeds generation
  async generateFeedsNow(): Promise<void> {
    log.info('Manual feeds generation triggered');
    await buildRSSandSitemap();
    await generateRobotsTxt();
  }

  // Get status of all scheduled tasks
  getStatus() {
    const now = new Date();
    
    return {
      isRunning: this.isRunning,
      activeTasks: this.tasks.length,
      tasks: this.tasks.map(task => ({
        name: (task as any).options?.name || 'unnamed',
        running: task.running
      })),
      nextBlogPosts: [
        this.getNextRun(8).toISOString(),
        this.getNextRun(13).toISOString(),
        this.getNextRun(18).toISOString()
      ],
      nextNewsletter: this.getNextNewsletter().toISOString(),
      uptime: process.uptime(),
      timestamp: now.toISOString()
    };
  }

  // Helper to get next run time for a given hour
  private getNextRun(hour: number): Date {
    const now = new Date();
    const next = new Date();
    next.setHours(hour, 0, 0, 0);
    
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    
    return next;
  }

  // Helper to get next newsletter send time (Mon/Wed/Fri at 8 AM)
  private getNextNewsletter(): Date {
    const now = new Date();
    const next = new Date();
    next.setHours(8, 0, 0, 0);
    
    // Newsletter days: 1=Monday, 3=Wednesday, 5=Friday
    const newsletterDays = [1, 3, 5];
    let currentDay = now.getDay();
    
    // If today is a newsletter day and it's before 8 AM, send today
    if (newsletterDays.includes(currentDay) && now.getHours() < 8) {
      return next;
    }
    
    // Otherwise find next newsletter day
    do {
      next.setDate(next.getDate() + 1);
      currentDay = next.getDay();
    } while (!newsletterDays.includes(currentDay));
    
    return next;
  }
}

// Create and export the global scheduler instance
export const automatedScheduler = new AutomatedBlogScheduler();