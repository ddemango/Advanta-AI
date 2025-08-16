import pino from 'pino';

export const log = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  },
  level: process.env.LOG_LEVEL || 'info'
});

// Helper function for retrying operations with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>, 
  label: string, 
  tries: number = 3
): Promise<T> {
  for (let i = 0; i < tries; i++) {
    try {
      const result = await fn();
      if (i > 0) {
        log.info({ label, attempt: i + 1 }, `Operation succeeded after retry`);
      }
      return result;
    } catch (error: any) {
      log.error({ label, attempt: i + 1, error: error?.message || String(error) }, `Operation attempt failed`);
      if (i === tries - 1) {
        log.error({ label, totalAttempts: tries }, `Operation failed after all retries`);
        throw error;
      }
      // Exponential backoff: 1s, 2s, 4s...
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error(`Unexpected end of retry loop for ${label}`);
}

// Structured logging helpers
export const blogLog = {
  generation: {
    start: (metadata?: any) => log.info({ module: 'blog-generation', ...metadata }, 'Starting blog post generation'),
    success: (slug: string, metadata?: any) => log.info({ module: 'blog-generation', slug, ...metadata }, 'Blog post generated successfully'),
    error: (error: any, metadata?: any) => log.error({ module: 'blog-generation', error: error?.message || String(error), ...metadata }, 'Blog post generation failed')
  },
  newsletter: {
    start: (count: number) => log.info({ module: 'newsletter', subscriberCount: count }, 'Starting newsletter send'),
    success: (sent: number, failed: number) => log.info({ module: 'newsletter', sent, failed }, 'Newsletter send completed'),
    error: (error: any) => log.error({ module: 'newsletter', error: error?.message || String(error) }, 'Newsletter send failed')
  },
  feeds: {
    start: () => log.info({ module: 'feeds' }, 'Starting RSS and sitemap generation'),
    success: (postCount: number) => log.info({ module: 'feeds', postCount }, 'RSS and sitemap generated successfully'),
    error: (error: any) => log.error({ module: 'feeds', error: error?.message || String(error) }, 'RSS and sitemap generation failed')
  },
  api: {
    request: (path: string, method: string, ip?: string) => log.debug({ module: 'api', path, method, ip }, 'API request'),
    slowQuery: (path: string, duration: number) => log.warn({ module: 'api', path, duration }, 'Slow API query detected')
  }
};