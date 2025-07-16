import { Resend } from 'resend';
import { db } from './db';
import { newsletterSubscribers, blogPosts } from '@shared/schema';
import { eq, and, desc, gte } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import * as cron from 'node-cron';

// Function to get yesterday's blog posts from file system
async function getYesterdaysBlogPosts(): Promise<any[]> {
  try {
    const postsDir = path.join(process.cwd(), 'posts');
    if (!fs.existsSync(postsDir)) {
      return [];
    }

    const files = fs.readdirSync(postsDir);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD format

    const yesterdayPosts = [];
    
    for (const file of files) {
      if (file.endsWith('.html') && file.includes(yesterdayStr)) {
        const filepath = path.join(postsDir, file);
        const content = fs.readFileSync(filepath, 'utf-8');
        
        // Extract metadata from HTML
        const titleMatch = content.match(/<title>(.*?)\|/);
        const categoryMatch = content.match(/meta name="category" content="([^"]+)"/);
        const dateMatch = content.match(/meta name="date" content="([^"]+)"/);
        
        if (titleMatch) {
          yesterdayPosts.push({
            filename: file,
            title: titleMatch[1].trim(),
            category: categoryMatch ? categoryMatch[1] : 'ai_technology',
            date: dateMatch ? dateMatch[1] : yesterdayStr,
            url: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/posts/${file}`
          });
        }
      }
    }

    return yesterdayPosts;
  } catch (error) {
    console.log(`Error fetching yesterday's blog posts: ${error}`);
    return [];
  }
}

// Function to create newsletter email template
function createNewsletterTemplate(posts: any[]): string {
  const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : 'http://localhost:5000';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const postsHtml = posts.map(post => `
    <tr>
      <td style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom: 10px;">
              <span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase;">
                ${post.category.replace('_', ' ')}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 10px;">
              <h2 style="margin: 0; font-size: 18px; line-height: 1.4; color: #1f2937;">
                <a href="${baseUrl}/posts/${post.filename}" style="color: #1f2937; text-decoration: none;">
                  ${post.title}
                </a>
              </h2>
            </td>
          </tr>
          <tr>
            <td>
              <a href="${baseUrl}/posts/${post.filename}" 
                 style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Read Article →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advanta AI Daily Newsletter - ${today}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
              <div style="display: inline-flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="color: #3b82f6; font-weight: bold; font-size: 20px;">A</span>
                </div>
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Advanta AI</h1>
              </div>
              <h2 style="color: white; margin: 0; font-size: 18px; font-weight: 500; opacity: 0.9;">Daily AI Insights</h2>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.8;">${today}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0;">
              ${posts.length > 0 ? `
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 30px 20px 20px;">
                      <h3 style="margin: 0 0 20px 0; font-size: 20px; color: #1f2937;">Latest Articles</h3>
                    </td>
                  </tr>
                  ${postsHtml}
                </table>
              ` : `
                <div style="padding: 40px 20px; text-align: center;">
                  <h3 style="color: #1f2937; margin-bottom: 10px;">No New Articles Yesterday</h3>
                  <p style="color: #6b7280; margin: 0;">Check back tomorrow for more AI insights!</p>
                </div>
              `}
            </td>
          </tr>
          
          <!-- CTA Section -->
          <tr>
            <td style="background: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937;">Ready to Transform Your Business?</h3>
              <p style="margin: 0 0 20px 0; color: #6b7280;">Discover how Advanta AI can help you implement cutting-edge solutions.</p>
              <a href="${baseUrl}/contact" 
                 style="display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Get Started Today
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; background: #f3f4f6; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                You're receiving this because you subscribed to Advanta AI newsletter.
              </p>
              <p style="margin: 0; font-size: 12px;">
                <a href="${baseUrl}/newsletter/unsubscribe?token={{unsubscribeToken}}" style="color: #6b7280;">Unsubscribe</a> |
                <a href="${baseUrl}/blog" style="color: #6b7280;">View All Articles</a> |
                <a href="${baseUrl}" style="color: #6b7280;">Visit Website</a>
              </p>
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

// Function to send newsletter to all active subscribers
export async function sendDailyNewsletter(): Promise<void> {
  try {
    console.log('📧 Starting daily newsletter sending process');
    
    // Get yesterday's blog posts
    const yesterdayPosts = await getYesterdaysBlogPosts();
    console.log(`📧 Found ${yesterdayPosts.length} blog posts from yesterday`);
    
    // Get all active subscribers
    const subscribers = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.isActive, true));
    
    console.log(`📧 Found ${subscribers.length} active newsletter subscribers`);
    
    if (subscribers.length === 0) {
      console.log('📧 No active subscribers found, skipping newsletter');
      return;
    }
    
    // Create email template
    const emailTemplate = createNewsletterTemplate(yesterdayPosts);
    
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
    
    for (const subscriber of subscribers) {
      try {
        const personalizedTemplate = emailTemplate.replace(
          '{{unsubscribeToken}}', 
          subscriber.unsubscribeToken || 'invalid'
        );
        
        await resend.emails.send({
          from: 'Advanta AI <hello@advanta-ai.com>',
          to: subscriber.email,
          subject: `🤖 Your Daily AI Insights - ${today}`,
          html: personalizedTemplate,
        });
        
        successCount++;
        console.log(`📧 Newsletter sent successfully to ${subscriber.email}`);
      } catch (error) {
        failureCount++;
        console.log(`📧 Failed to send newsletter to ${subscriber.email}: ${error}`);
      }
    }
    
    console.log(`📧 Newsletter sending completed: ${successCount} successful, ${failureCount} failed`);
  } catch (error) {
    console.log(`📧 Error in daily newsletter process: ${error}`);
  }
}

// Function to schedule daily newsletter (called from main scheduler)
export function scheduleNewsletterSending(): void {
  // Send newsletter every day at 8:00 AM using cron
  cron.schedule('0 8 * * *', async () => {
    console.log('📧 Daily newsletter cron job triggered at 8:00 AM');
    await sendDailyNewsletter();
  }, {
    scheduled: true,
    timezone: "America/New_York"
  });
  
  const nextRun = new Date();
  nextRun.setHours(8, 0, 0, 0);
  if (nextRun <= new Date()) {
    nextRun.setDate(nextRun.getDate() + 1);
  }
  
  console.log(`📧 Newsletter scheduled for ${nextRun.toLocaleString()}`);
}

// Function to manually send newsletter (for testing)
export async function sendTestNewsletter(): Promise<void> {
  console.log('📧 Manual newsletter test initiated');
  await sendDailyNewsletter();
}