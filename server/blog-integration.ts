// Integration script to initialize the complete automated blog system
import { automatedScheduler } from './automated-scheduler';
import { generateEnhancedBlogPost } from './enhanced-daily-blog';
import { sendEnhancedDailyNewsletter } from './enhanced-newsletter';
import { buildRSSandSitemap, generateRobotsTxt } from './feeds';
import { log } from './logger';

export class BlogSystemIntegration {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      log.warn('Blog system already initialized');
      return;
    }

    try {
      log.info('🚀 Initializing comprehensive blog automation system...');

      // Initialize SQLite database (already done in blog-db.ts import)
      log.info('✅ SQLite database initialized');

      // Generate initial feeds if they don't exist
      await this.ensureInitialContent();

      // Start the automated scheduler
      automatedScheduler.start();
      log.info('✅ Automated scheduler started');

      this.isInitialized = true;
      log.info('🎉 Blog automation system fully initialized');

      // Log system status
      const status = automatedScheduler.getStatus();
      log.info({
        activeTasks: status.activeTasks,
        nextBlogPosts: status.nextBlogPosts,
        nextNewsletter: status.nextNewsletter
      }, 'System status after initialization');

    } catch (error: any) {
      log.error({ error: error?.message || String(error) }, 'Failed to initialize blog system');
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      automatedScheduler.stop();
      this.isInitialized = false;
      log.info('🛑 Blog automation system stopped');
    } catch (error: any) {
      log.error({ error: error?.message || String(error) }, 'Failed to stop blog system');
    }
  }

  private async ensureInitialContent(): Promise<void> {
    try {
      // Generate initial RSS and sitemap
      await buildRSSandSitemap();
      await generateRobotsTxt();
      log.info('✅ Initial RSS, sitemap, and robots.txt generated');
    } catch (error: any) {
      log.warn({ error: error?.message || String(error) }, 'Failed to generate initial content, continuing anyway');
    }
  }

  // Manual trigger methods for admin use
  async triggerBlogGeneration(): Promise<void> {
    log.info('Manual blog generation triggered');
    await generateEnhancedBlogPost();
  }

  async triggerNewsletterSend(): Promise<void> {
    log.info('Manual newsletter send triggered');
    await sendEnhancedDailyNewsletter();
  }

  async triggerFeedsUpdate(): Promise<void> {
    log.info('Manual feeds update triggered');
    await buildRSSandSitemap();
    await generateRobotsTxt();
  }

  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      scheduler: automatedScheduler.getStatus()
    };
  }
}

// Export singleton instance
export const blogSystem = new BlogSystemIntegration();