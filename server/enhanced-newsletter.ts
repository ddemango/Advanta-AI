import { Resend } from 'resend';
import { db } from './db';
import { newsletterSubscribers } from '@shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { log, blogLog } from './logger';

// Enhanced function to get recent blog posts from file system
async function getEnhancedRecentPosts(): Promise<any[]> {
  try {
    const postsDir = path.join(process.cwd(), 'posts');
    if (!fs.existsSync(postsDir)) {
      log.warn('Posts directory not found');
      return [];
    }

    const files = fs.readdirSync(postsDir);
    const recentPosts = [];
    
    // Get posts from the last 7 days
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    for (const file of files) {
      if (file.endsWith('.html')) {
        // Extract date from filename
        const dateMatch = file.match(/^(\\d{4}-\\d{2}-\\d{2})-/);
        if (dateMatch) {
          const fileDate = new Date(dateMatch[1]);
          fileDate.setHours(12, 0, 0, 0);
          
          if (fileDate >= sevenDaysAgo && fileDate <= today) {
            const filepath = path.join(postsDir, file);
            const content = fs.readFileSync(filepath, 'utf-8');
            
            // Extract enhanced metadata
            const titleMatch = content.match(/<title>(.*?)\\|/);
            const categoryMatch = content.match(/meta name="category" content="([^"]+)"/);
            const tagsMatch = content.match(/meta name="tags" content="([^"]+)"/);
            const readingTimeMatch = content.match(/meta name="reading-time" content="([^"]+)"/);
            const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
            
            if (titleMatch) {
              const slug = file.replace('.html', '').replace(/^\\d{4}-\\d{2}-\\d{2}-/, '');
              const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean) : [];
              
              recentPosts.push({
                filename: file,
                title: titleMatch[1].trim(),
                category: categoryMatch ? categoryMatch[1] : 'ai_technology',
                tags,
                readingTime: readingTimeMatch ? parseInt(readingTimeMatch[1]) : 5,
                description: descMatch ? descMatch[1] : `${titleMatch[1].trim().substring(0, 120)}...`,
                date: dateMatch[1],
                slug: slug,
                url: `${process.env.REPLIT_DOMAINS?.split(',')[0] ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 'http://localhost:5000'}/blog/${slug}`,
                fileDate: fileDate
              });
            }
          }
        }
      }
    }

    // Sort by date (newest first) and return up to 3 most recent posts
    return recentPosts
      .sort((a, b) => b.fileDate.getTime() - a.fileDate.getTime())
      .slice(0, 3);
      
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Error fetching enhanced recent blog posts');
    return [];
  }
}

// Enhanced newsletter template with better design and interactivity
function createEnhancedNewsletterTemplate(posts: any[]): string {
  const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : 'http://localhost:5000';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categoryColors = {
    'ai_technology': '#3b82f6',
    'business_strategy': '#10b981',
    'automation': '#8b5cf6',
    'marketing_ai': '#f59e0b',
    'case_studies': '#ef4444',
    'tutorials': '#06b6d4',
    'industry_insights': '#84cc16'
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
  };

  const postsHtml = posts.map(post => `
    <tr>
      <td style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="background: ${categoryColors[post.category] || '#6b7280'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${formatCategory(post.category)}
                </span>
                <span style="color: #6b7280; font-size: 12px;">
                  ${post.readingTime} min read
                </span>
              </div>
              ${post.tags.length > 0 ? `
                <div style="margin-bottom: 8px;">
                  ${post.tags.slice(0, 3).map(tag => `
                    <span style="background: #f3f4f6; color: #4b5563; padding: 2px 8px; border-radius: 12px; font-size: 10px; margin-right: 4px;">
                      #${tag}
                    </span>
                  `).join('')}
                </div>
              ` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 12px;">
              <h2 style="margin: 0; font-size: 20px; line-height: 1.3; color: #1f2937; font-weight: 600;">
                <a href="${post.url}" style="color: #1f2937; text-decoration: none;">
                  ${post.title}
                </a>
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 16px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
                ${post.description}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <a href="${post.url}" 
                 style="display: inline-block; background: ${categoryColors[post.category] || '#3b82f6'}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; transition: all 0.2s;">
                Read Full Article →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const featuredInsight = posts.length > 0 ? posts[0] : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advanta AI Weekly Intelligence - ${today}</title>
  <style>
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 10px !important; }
      .content { padding: 20px !important; }
      .header { padding: 30px 20px !important; }
      .cta-section { padding: 20px !important; }
      h1 { font-size: 20px !important; }
      h2 { font-size: 18px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 20px 0; min-height: 100vh;">
    <tr>
      <td align="center">
        <table class="container" width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <!-- Header -->
          <tr>
            <td class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white;">
              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <div style="width: 48px; height: 48px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                  <span style="color: #667eea; font-weight: 700; font-size: 24px;">A</span>
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Advanta AI</h1>
              </div>
              <h2 style="color: white; margin: 0; font-size: 20px; font-weight: 400; opacity: 0.95;">Weekly AI Intelligence</h2>
              <p style="color: white; margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">${today}</p>
            </td>
          </tr>
          
          ${featuredInsight ? `
          <!-- Featured Insight -->
          <tr>
            <td style="background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%); padding: 30px; border-bottom: 1px solid #e5e7eb;">
              <div style="text-align: center;">
                <h3 style="margin: 0 0 12px 0; font-size: 18px; color: #92400e; font-weight: 600;">
                  🌟 This Week's Featured Insight
                </h3>
                <h2 style="margin: 0 0 16px 0; font-size: 22px; color: #1f2937; font-weight: 700; line-height: 1.3;">
                  ${featuredInsight.title}
                </h2>
                <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                  ${featuredInsight.description}
                </p>
                <a href="${featuredInsight.url}" 
                   style="display: inline-block; background: #92400e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Read Featured Article →
                </a>
              </div>
            </td>
          </tr>
          ` : ''}
          
          <!-- Content -->
          <tr>
            <td class="content" style="padding: 0;">
              ${posts.length > 0 ? `
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 30px 30px 20px; text-align: center;">
                      <h3 style="margin: 0 0 8px 0; font-size: 24px; color: #1f2937; font-weight: 700;">Latest AI Intelligence</h3>
                      <p style="margin: 0; color: #6b7280; font-size: 16px;">Your weekly dose of actionable AI insights</p>
                    </td>
                  </tr>
                  ${postsHtml}
                </table>
              ` : `
                <div style="padding: 60px 30px; text-align: center;">
                  <div style="width: 64px; height: 64px; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                    <span style="font-size: 24px;">🤖</span>
                  </div>
                  <h3 style="color: #1f2937; margin: 0 0 12px 0; font-size: 20px;">New Content Coming Soon</h3>
                  <p style="color: #6b7280; margin: 0; font-size: 16px;">We're preparing fresh AI insights for you!</p>
                </div>
              `}
            </td>
          </tr>
          
          <!-- Value Proposition -->
          <tr>
            <td style="background: #f8fafc; padding: 30px; border-top: 1px solid #e5e7eb;">
              <div style="text-align: center; max-width: 480px; margin: 0 auto;">
                <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px; font-weight: 600;">
                  Why Leading Businesses Choose Advanta AI
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; margin-bottom: 24px;">
                  <div style="text-align: center;">
                    <div style="background: #3b82f6; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: 600;">7</div>
                    <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 500;">Days to Deploy</p>
                  </div>
                  <div style="text-align: center;">
                    <div style="background: #10b981; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: 600;">5x</div>
                    <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 500;">Faster ROI</p>
                  </div>
                  <div style="text-align: center;">
                    <div style="background: #8b5cf6; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: 600;">∞</div>
                    <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 500;">Scalability</p>
                  </div>
                </div>
                <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
                  Enterprise-grade AI solutions delivered in days, not months. Transform your business with intelligent automation.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- CTA Section -->
          <tr>
            <td class="cta-section" style="background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%); padding: 40px 30px; text-align: center;">
              <h3 style="margin: 0 0 12px 0; color: white; font-size: 22px; font-weight: 600;">Ready to Transform Your Business?</h3>
              <p style="margin: 0 0 24px 0; color: #cbd5e1; font-size: 16px; line-height: 1.5;">Join 500+ companies already using Advanta AI to automate their workflows and accelerate growth.</p>
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <a href="${baseUrl}/contact" 
                   style="display: inline-block; background: white; color: #1e40af; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 4px;">
                  Start Your AI Journey
                </a>
                <a href="${baseUrl}/blog" 
                   style="display: inline-block; background: transparent; color: white; border: 2px solid white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 4px;">
                  Explore All Articles
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; text-align: center; background: #f1f5f9; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">
                You're receiving this because you subscribed to Advanta AI intelligence updates.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                <a href="${baseUrl}/newsletter/unsubscribe?token={{unsubscribeToken}}" style="color: #64748b; margin: 0 8px;">Unsubscribe</a> |
                <a href="${baseUrl}/blog" style="color: #64748b; margin: 0 8px;">View All Articles</a> |
                <a href="${baseUrl}" style="color: #64748b; margin: 0 8px;">Visit Website</a> |
                <a href="${baseUrl}/privacy" style="color: #64748b; margin: 0 8px;">Privacy Policy</a>
              </p>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                  © ${new Date().getFullYear()} Advanta AI. All rights reserved.<br>
                  Leading AI consultancy delivering enterprise solutions in 7 days.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Enhanced newsletter sending function
export async function sendEnhancedDailyNewsletter(): Promise<void> {
  blogLog.newsletter.start(0);
  
  try {
    log.info('📧 Starting enhanced newsletter sending process');
    
    // Get recent blog posts
    const recentPosts = await getEnhancedRecentPosts();
    log.info({ count: recentPosts.length }, '📧 Found recent blog posts for newsletter');
    
    // Get all active subscribers from PostgreSQL
    const subscribers = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.isActive, true));
    
    log.info({ count: subscribers.length }, '📧 Found active newsletter subscribers');
    
    if (subscribers.length === 0) {
      log.warn('📧 No active subscribers found, skipping newsletter');
      return;
    }
    
    // Create enhanced email template
    const emailTemplate = createEnhancedNewsletterTemplate(recentPosts);
    
    // Create Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    let successCount = 0;
    let failureCount = 0;
    
    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (subscriber) => {
          try {
            const personalizedTemplate = emailTemplate.replace(
              '{{unsubscribeToken}}', 
              subscriber.unsubscribeToken || 'invalid'
            );
            
            await resend.emails.send({
              from: 'Advanta AI Intelligence <hello@advanta-ai.com>',
              to: subscriber.email,
              subject: `🤖 Your AI Intelligence Update - ${today}`,
              html: personalizedTemplate,
            });
            
            successCount++;
            log.debug({ email: subscriber.email }, '📧 Newsletter sent successfully');
          } catch (error: any) {
            failureCount++;
            log.error({ 
              email: subscriber.email, 
              error: error?.message || String(error) 
            }, '📧 Failed to send newsletter');
          }
        })
      );
      
      // Small delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const finalMessage = `Newsletter sending completed: ${successCount} successful, ${failureCount} failed`;
    log.info({ successCount, failureCount, totalSubscribers: subscribers.length }, finalMessage);
    blogLog.newsletter.success(successCount, failureCount);
    
  } catch (error: any) {
    const errorMessage = `Error in enhanced newsletter process: ${error?.message || String(error)}`;
    log.error({ error: error?.message || String(error) }, errorMessage);
    blogLog.newsletter.error(error);
    throw error;
  }
}