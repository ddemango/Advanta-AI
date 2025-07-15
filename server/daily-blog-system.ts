import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import * as cron from "node-cron";
import { log } from "./vite";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Blog topics rotation for daily posts
const blogTopicsPool = [
  "How GPT-4o Is Changing SaaS Development in 2025",
  "Top 5 AI Tools for Marketing Automation This Year",
  "The Future of AI Client Portals: What Businesses Need to Know",
  "AI vs Manual Workflows: A Complete Cost Comparison",
  "Build Your First AI Stack in 24 Hours: Step-by-Step Guide",
  "Marketing AI Revolution: Tools That Actually Drive ROI",
  "Automating Customer Service with Conversational AI",
  "AI-Powered Analytics: Transform Your Business Intelligence",
  "From Chatbots to AI Agents: The Evolution of Business Automation",
  "Scaling Your Agency with AI: Real Success Stories",
  "The Complete Guide to AI Implementation for SMBs",
  "AI Tools for Content Creation: Boost Your Marketing Team",
  "Predictive Analytics with AI: Future-Proof Your Business",
  "AI-Enhanced CRM: Revolutionize Your Sales Process",
  "Building Custom GPTs for Your Business: Practical Applications",
  "AI in Project Management: Tools and Strategies for 2025",
  "Voice AI Applications: The Next Frontier for Businesses",
  "AI-Driven Personalization: Increase Customer Engagement",
  "Automation Testing with AI: Quality Assurance Revolution",
  "AI for Financial Planning: Smart Business Decision Making",
  "Computer Vision in Business: Practical Use Cases",
  "AI-Powered Document Processing: Streamline Operations",
  "Machine Learning for Business Forecasting",
  "AI Ethics in Business: Guidelines for Responsible Implementation",
  "Natural Language Processing for Customer Insights",
  "AI-Enhanced E-commerce: Boost Sales with Smart Recommendations",
  "Workflow Optimization with AI: Efficiency Gains That Matter",
  "AI Tools for Remote Teams: Collaboration in the Digital Age",
  "Business Intelligence Meets AI: Data-Driven Decisions",
  "AI Security Solutions: Protecting Your Digital Assets"
];

// Categories for topic variety
const categories = [
  "ai_technology",
  "business_strategy", 
  "automation",
  "marketing_ai",
  "case_studies",
  "tutorials",
  "industry_insights"
];

// Function to generate a slugified filename from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Function to get current date in YYYY-MM-DD format
function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Function to generate blog post content using GPT-4o
async function generateBlogContent(topic: string): Promise<{ title: string, content: string, category: string }> {
  try {
    const prompt = `
You are a professional AI and technology writer for Advanta AI, a leading AI consultancy company. 

Generate a comprehensive, SEO-optimized blog post on the topic: "${topic}"

Requirements:
- Target audience: Digital marketers, SaaS builders, entrepreneurs, agency owners
- Tone: Professional yet conversational, educational, actionable
- Length: 1200-1500 words
- Include specific examples and practical insights
- Focus on business value and ROI

Structure the blog post exactly as follows:

TITLE: [Create an engaging, SEO-optimized title]

CATEGORY: [Choose one: ai_technology, business_strategy, automation, marketing_ai, case_studies, tutorials, industry_insights]

CONTENT:
[Introduction paragraph that hooks the reader and outlines what they'll learn]

## [First main section heading]
[Detailed content with practical insights, examples, and actionable advice]

## [Second main section heading]  
[More detailed content with specific use cases and benefits]

## [Third main section heading]
[Implementation guidance, best practices, or future outlook]

## Conclusion
[Summary of key points and call-to-action that encourages readers to contact Advanta AI for consultation]

Make sure the content is original, informative, and positions Advanta AI as a thought leader in AI business solutions.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const fullContent = response.choices[0].message.content || '';
    
    // Parse the response to extract title, category, and content
    const titleMatch = fullContent.match(/TITLE:\s*(.+)/);
    const categoryMatch = fullContent.match(/CATEGORY:\s*(.+)/);
    const contentMatch = fullContent.match(/CONTENT:\s*([\s\S]*)/);
    
    const title = titleMatch ? titleMatch[1].trim() : topic;
    const category = categoryMatch ? categoryMatch[1].trim() : 'ai_technology';
    const content = contentMatch ? contentMatch[1].trim() : fullContent;

    return { title, content, category };
  } catch (error) {
    log(`Error generating blog content: ${error}`, "blog-generator");
    throw error;
  }
}

// Function to save blog post as HTML file
async function saveBlogPostHTML(title: string, content: string, category: string): Promise<string> {
  try {
    const date = getCurrentDate();
    const slug = slugify(title);
    const filename = `${date}-${slug}.html`;
    const filepath = path.join(process.cwd(), 'posts', filename);

    // Ensure posts directory exists
    const postsDir = path.join(process.cwd(), 'posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // Create HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Advanta AI Blog</title>
    <meta name="description" content="${content.substring(0, 160).replace(/<[^>]*>/g, '')}...">
    <meta name="category" content="${category}">
    <meta name="date" content="${date}">
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            color: #333;
        }
        h1 { 
            color: #2563eb; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 10px;
        }
        h2 { 
            color: #1f2937; 
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .meta {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 20px;
            padding: 10px;
            background: #f9fafb;
            border-left: 4px solid #2563eb;
        }
        .category {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="category">${category.replace('_', ' ').toUpperCase()}</div>
    <h1>${title}</h1>
    <div class="meta">
        <strong>Published:</strong> ${date} | <strong>Advanta AI Blog</strong>
    </div>
    ${content.replace(/## /g, '<h2>').replace(/\n\n/g, '</p><p>').replace(/^(.)/g, '<p>$1').replace(/(.*)$/, '$1</p>')}
    
    <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;">
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
        <h3 style="color: #2563eb; margin-top: 0;">Ready to Transform Your Business with AI?</h3>
        <p>Contact Advanta AI today for a free consultation and discover how our custom AI solutions can drive growth and efficiency in your organization.</p>
        <a href="/contact" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Get Started Today</a>
    </div>
</body>
</html>`;

    // Write the file
    fs.writeFileSync(filepath, htmlContent, 'utf8');
    
    log(`✅ Blog post saved: ${filename}`, "blog-generator");
    return filename;
  } catch (error) {
    log(`Error saving blog post: ${error}`, "blog-generator");
    throw error;
  }
}

// Function to get all blog posts from the posts directory
export function getAllBlogPosts(): Array<{
  filename: string;
  title: string;
  date: string;
  category: string;
  preview: string;
  slug: string;
}> {
  try {
    const postsDir = path.join(process.cwd(), 'posts');
    
    if (!fs.existsSync(postsDir)) {
      return [];
    }

    const files = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.html'))
      .sort((a, b) => b.localeCompare(a)); // Sort newest first

    return files.map(filename => {
      const filepath = path.join(postsDir, filename);
      const content = fs.readFileSync(filepath, 'utf8');
      
      // Extract metadata from HTML
      const titleMatch = content.match(/<title>([^|]+)/);
      const categoryMatch = content.match(/content="([^"]+)"/);
      const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
      
      const title = titleMatch ? titleMatch[1].trim().replace(/[\*\#]+/g, '').trim() : filename.replace('.html', '').replace(/[\*\#]+/g, '').trim();
      const date = dateMatch ? dateMatch[1] : '';
      const category = content.includes('meta name="category"') ? 
        content.match(/meta name="category" content="([^"]+)"/)?.[1]?.replace(/[\*]+/g, '') || 'general' : 'general';
      
      // Get preview text (first paragraph)
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/);
      const bodyContent = bodyMatch ? bodyMatch[1] : '';
      const preview = bodyContent.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
      
      // Generate slug from filename
      const slug = filename.replace('.html', '');

      return {
        filename,
        title,
        date,
        category,
        preview,
        slug
      };
    });
  } catch (error) {
    log(`Error reading blog posts: ${error}`, "blog-generator");
    return [];
  }
}

// Function to generate a single blog post
export async function generateDailyBlogPost(): Promise<void> {
  try {
    // Get a random topic from the pool
    const randomTopic = blogTopicsPool[Math.floor(Math.random() * blogTopicsPool.length)];
    
    log(`📝 Generating blog post: ${randomTopic}`, "blog-generator");
    
    // Generate content
    const { title, content, category } = await generateBlogContent(randomTopic);
    
    // Save as HTML file
    const filename = await saveBlogPostHTML(title, content, category);
    
    log(`✅ Successfully generated blog post: ${title} (${filename})`, "blog-generator");
  } catch (error) {
    log(`❌ Error generating daily blog post: ${error}`, "blog-generator");
    throw error;
  }
}

// Blog scheduler class for managing the daily automation
export class DailyBlogScheduler {
  private schedules: cron.ScheduledTask[] = [];
  private isRunning = false;

  // Start the scheduler with 3 daily posts (8am, 1pm, 6pm)
  start(): void {
    if (this.isRunning) {
      log("Blog scheduler already running", "blog-scheduler");
      return;
    }

    log("🚀 Starting daily blog scheduler (3 posts per day)", "blog-scheduler");

    // Schedule 1: 8:00 AM daily
    const schedule1 = cron.schedule('0 8 * * *', async () => {
      log("⏰ Morning blog post generation triggered (8:00 AM)", "blog-scheduler");
      await this.generateWithRetry();
    }, {
      scheduled: false,
      timezone: "America/New_York"
    });

    // Schedule 2: 1:00 PM daily  
    const schedule2 = cron.schedule('0 13 * * *', async () => {
      log("⏰ Afternoon blog post generation triggered (1:00 PM)", "blog-scheduler");
      await this.generateWithRetry();
    }, {
      scheduled: false,
      timezone: "America/New_York"
    });

    // Schedule 3: 6:00 PM daily
    const schedule3 = cron.schedule('0 18 * * *', async () => {
      log("⏰ Evening blog post generation triggered (6:00 PM)", "blog-scheduler");
      await this.generateWithRetry();
    }, {
      scheduled: false,
      timezone: "America/New_York"
    });

    this.schedules = [schedule1, schedule2, schedule3];
    
    // Start all schedules
    this.schedules.forEach(schedule => schedule.start());
    this.isRunning = true;

    // Generate initial post if no posts exist
    this.generateInitialPostIfNeeded();
    
    log("✅ Daily blog scheduler started successfully", "blog-scheduler");
  }

  // Stop the scheduler
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.schedules.forEach(schedule => schedule.destroy());
    this.schedules = [];
    this.isRunning = false;
    
    log("🛑 Daily blog scheduler stopped", "blog-scheduler");
  }

  // Generate blog post with retry logic
  private async generateWithRetry(maxRetries = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await generateDailyBlogPost();
        return; // Success, exit retry loop
      } catch (error) {
        log(`❌ Blog generation attempt ${attempt} failed: ${error}`, "blog-scheduler");
        
        if (attempt === maxRetries) {
          log(`🚨 Failed to generate blog post after ${maxRetries} attempts`, "blog-scheduler");
          break;
        }
        
        // Wait before retry (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // Generate an initial post if the posts directory is empty
  private async generateInitialPostIfNeeded(): Promise<void> {
    try {
      const existingPosts = getAllBlogPosts();
      
      if (existingPosts.length === 0) {
        log("📝 No existing posts found, generating initial blog post", "blog-scheduler");
        await this.generateWithRetry();
      } else {
        log(`📚 Found ${existingPosts.length} existing blog posts`, "blog-scheduler");
      }
    } catch (error) {
      log(`Error checking for initial posts: ${error}`, "blog-scheduler");
    }
  }

  // Manual trigger for testing
  async generateNow(): Promise<void> {
    log("🔧 Manual blog post generation triggered", "blog-scheduler");
    await this.generateWithRetry();
  }

  // Get status
  getStatus(): { isRunning: boolean; schedulesCount: number; postsCount: number } {
    return {
      isRunning: this.isRunning,
      schedulesCount: this.schedules.length,
      postsCount: getAllBlogPosts().length
    };
  }
}