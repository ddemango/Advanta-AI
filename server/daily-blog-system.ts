import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import * as cron from "node-cron";
import { log } from "./vite";
import { scheduleNewsletterSending } from './newsletter-system';

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

// Function to convert markdown to HTML
function convertMarkdownToHtml(content: string): string {
  // Convert markdown headings to HTML
  content = content.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  content = content.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  
  // Convert markdown bold to HTML
  content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert markdown italic to HTML
  content = content.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert line breaks to paragraphs
  const paragraphs = content.split('\n\n');
  content = paragraphs.map(p => {
    p = p.trim();
    if (p.startsWith('<h2>') || p.startsWith('<h3>')) {
      return p;
    }
    return p ? `<p>${p}</p>` : '';
  }).filter(p => p).join('\n\n');
  
  return content;
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
    let content = contentMatch ? contentMatch[1].trim() : fullContent;
    
    // CRITICAL FIX: Remove ```html``` and ``` markdown code blocks
    content = content.replace(/^```html\s*/i, '').replace(/\s*```$/, '');
    content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    // Convert markdown to HTML and fix structure
    content = convertMarkdownToHtml(content);
    
    // FIX: Clean up malformed HTML structure
    content = content.replace(/<p><h2>/g, '</p><h2>');
    content = content.replace(/<\/h2><\/p>/g, '</h2><p>');
    content = content.replace(/<p><h3>/g, '</p><h3>');
    content = content.replace(/<\/h3><\/p>/g, '</h3><p>');
    
    // Ensure proper paragraph structure
    content = content.replace(/(<\/p>)\s*(<p>)/g, '$1\n$2');
    content = content.replace(/(<\/h[1-6]>)\s*(<p>)/g, '$1\n$2');
    content = content.replace(/(<\/p>)\s*(<h[1-6]>)/g, '$1\n$2');

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

    // Create professional HTML content with enhanced styling
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Advanta AI Blog</title>
    <meta name="description" content="${content.substring(0, 160).replace(/<[^>]*>/g, '')}...">
    <meta name="category" content="${category}">
    <meta name="date" content="${date}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .article-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        
        .article-content {
            padding: 60px 40px;
        }
        
        .article-content h2 {
            color: #1e40af;
            font-size: 28px;
            font-weight: 700;
            margin: 40px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .article-content h3 {
            color: #374151;
            font-size: 22px;
            font-weight: 600;
            margin: 30px 0 15px 0;
        }
        
        .article-content p {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 20px;
            color: #4b5563;
        }
        
        .article-content ul, .article-content ol {
            margin: 20px 0;
            padding-left: 20px;
        }
        
        .article-content li {
            margin-bottom: 10px;
            font-size: 16px;
            line-height: 1.7;
            color: #4b5563;
        }
        
        .article-content strong {
            color: #1f2937;
            font-weight: 600;
        }
        
        .article-content em {
            font-style: italic;
            color: #6b7280;
        }
        
        .article-header {
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            padding: 60px 40px 40px;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .article-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        }
        
        .category-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            color: white;
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            position: relative;
            z-index: 1;
        }
        
        .article-title {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .article-meta {
            font-size: 14px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .article-content {
            padding: 60px 40px;
        }
        
        .article-content h2 {
            color: #1f2937;
            font-size: 1.8rem;
            font-weight: 600;
            margin: 40px 0 20px;
            position: relative;
            padding-left: 20px;
        }
        
        .article-content h2::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 100%;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            border-radius: 2px;
        }
        
        .article-content h3 {
            color: #374151;
            font-size: 1.4rem;
            font-weight: 600;
            margin: 30px 0 15px;
        }
        
        .article-content p {
            margin-bottom: 24px;
            font-size: 16px;
            line-height: 1.8;
            color: #4b5563;
        }
        
        .article-content ul, .article-content ol {
            margin: 24px 0;
            padding-left: 0;
        }
        
        .article-content li {
            margin-bottom: 12px;
            padding-left: 30px;
            position: relative;
            color: #4b5563;
            line-height: 1.7;
        }
        
        .article-content ul li::before {
            content: '→';
            position: absolute;
            left: 0;
            color: #3b82f6;
            font-weight: 600;
        }
        
        .cta-section {
            background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
            color: white;
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .cta-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M30 30l15-15v30L30 30zM15 15l15 15L15 45V15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        }
        
        .cta-title {
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
        }
        
        .cta-description {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 25px;
            position: relative;
            z-index: 1;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: #1e40af;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 768px) {
            .article-header {
                padding: 40px 20px 30px;
            }
            
            .article-title {
                font-size: 2rem;
            }
            
            .article-content {
                padding: 40px 20px;
            }
            
            .cta-section {
                padding: 40px 20px;
            }
        }
    </style>
</head>
<body>
    <article class="article-container">
        <header class="article-header">
            <div class="category-badge">${category.replace(/[\*_]/g, '').replace('_', ' ').toUpperCase()}</div>
            <h1 class="article-title">${title.replace(/[\*]/g, '')}</h1>
            <div class="article-meta">Published: ${date} | Advanta AI Blog</div>
        </header>
        
        <div class="article-content">
            ${content.replace(/\*\*/g, '').replace(/## /g, '<h2>').replace(/<h2>/g, '<h2 class="section-heading">').replace(/\n\n/g, '</p><p>').replace(/^([^<])/gm, '<p>$1').replace(/([^>])$/gm, '$1</p>').replace(/<p><\/p>/g, '')}
        </div>
        
        <div class="cta-section">
            <h3 class="cta-title">Ready to Transform Your Business with AI?</h3>
            <p class="cta-description">Discover how Advanta AI can help you implement cutting-edge solutions tailored to your industry. Contact our experts today for a personalized consultation.</p>
            <a href="/contact" class="cta-button">Get Started with Advanta AI →</a>
        </div>
    </article>
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
      
      // Extract clean preview text from the first paragraph
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/);
      const bodyContent = bodyMatch ? bodyMatch[1] : '';
      
      // Find the first paragraph content
      const paragraphMatch = bodyContent.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      let cleanText = '';
      
      if (paragraphMatch) {
        // Extract text from first paragraph
        cleanText = paragraphMatch[1]
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/^\s+|\s+$/g, '') // Trim whitespace
          .substring(0, 200);
      } else {
        // Fallback: extract from entire body
        cleanText = bodyContent
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/^\s+|\s+$/g, '') // Trim whitespace
          .substring(0, 200);
      }
      
      // Add ellipsis if text was truncated
      const preview = cleanText.length === 200 ? cleanText + '...' : cleanText;
      
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
    
    // Initialize newsletter scheduling
    try {
      scheduleNewsletterSending();
      log("📧 Newsletter scheduling initialized", "blog-scheduler");
    } catch (error) {
      log(`❌ Newsletter scheduling failed: ${error}`, "blog-scheduler");
    }
    
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