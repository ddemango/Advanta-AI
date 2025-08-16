import { log, blogLog, withRetry } from './logger';
import { logGeneration, trackAPIUsage } from './blog-db';
import { runQualityGates } from './quality-gates';
import { shareToAllPlatforms } from './social';
import { buildRSSandSitemap } from './feeds';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced blog topics with better categorization
const enhancedBlogTopics = [
  { topic: "How GPT-4o Is Revolutionizing Business Automation in 2025", category: "ai_technology" },
  { topic: "Complete Guide to AI Workflow Implementation for SMBs", category: "tutorials" },
  { topic: "ROI Analysis: AI vs Manual Processes in Customer Service", category: "business_strategy" },
  { topic: "Building AI-Powered Sales Funnels That Convert", category: "marketing_ai" },
  { topic: "Case Study: 300% Efficiency Gain with AI Document Processing", category: "case_studies" },
  { topic: "AI Ethics in Business: Practical Guidelines for 2025", category: "industry_insights" },
  { topic: "Automating Lead Qualification with Conversational AI", category: "automation" },
  { topic: "The Future of AI Client Portals and Customer Experience", category: "industry_insights" },
  { topic: "AI Tools for Content Marketing: Beyond Basic Generation", category: "marketing_ai" },
  { topic: "Implementing AI Analytics for Predictive Business Intelligence", category: "tutorials" }
];

// Enhanced tags system
function generateEnhancedTags(content: string, category: string): string[] {
  const tags = new Set<string>();
  
  // Category-based tags
  const categoryTags: Record<string, string[]> = {
    'ai_technology': ['artificial-intelligence', 'technology', 'innovation'],
    'business_strategy': ['strategy', 'business', 'growth'],
    'automation': ['automation', 'workflow', 'efficiency'],
    'marketing_ai': ['marketing', 'ai-marketing', 'digital-strategy'],
    'case_studies': ['case-study', 'success-story', 'results'],
    'tutorials': ['tutorial', 'guide', 'how-to'],
    'industry_insights': ['insights', 'trends', 'analysis']
  };
  
  // Add category-specific tags
  if (categoryTags[category]) {
    categoryTags[category].forEach(tag => tags.add(tag));
  }
  
  // Content-based tag detection
  const lowerContent = content.toLowerCase();
  const contentChecks = [
    ['chatbot', 'chatbot'], ['customer service', 'customer-service'], 
    ['sales', 'sales'], ['crm', 'crm'], ['seo', 'seo'],
    ['roi', 'roi'], ['machine learning', 'machine-learning'],
    ['data analytics', 'analytics'], ['integration', 'integration'],
    ['api', 'api'], ['workflow', 'workflow'], ['saas', 'saas']
  ];
  
  for (const [needle, tag] of contentChecks) {
    if (lowerContent.includes(needle)) {
      tags.add(tag);
    }
  }
  
  return Array.from(tags).slice(0, 8); // Return up to 8 tags
}

// Enhanced HTML template with full SEO and structured data
function createEnhancedHtmlTemplate({
  title,
  description,
  category,
  tags,
  bodyHtml,
  canonicalSlug,
  dateStr
}: {
  title: string;
  description: string;
  category: string;
  tags: string[];
  bodyHtml: string;
  canonicalSlug: string;
  dateStr: string;
}): string {
  const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : 'https://advanta-ai.com';
    
  const tagsMeta = tags.length ? `<meta name="tags" content="${tags.join(',')}">` : '';
  const readingTime = Math.max(1, Math.ceil(bodyHtml.split(' ').length / 200));
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": new Date(dateStr).toISOString(),
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Advanta AI",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Advanta AI",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
        "width": 200,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${canonicalSlug}`
    },
    "articleSection": category.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase()),
    "keywords": tags.join(', '),
    "wordCount": bodyHtml.split(' ').length,
    "timeRequired": `PT${readingTime}M`
  };

  return `<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns# article: http://ogp.me/ns/article#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Advanta AI</title>
    <meta name="description" content="${description}">
    <meta name="category" content="${category}">
    <meta name="date" content="${dateStr}">
    <meta name="reading-time" content="${readingTime}">
    ${tagsMeta}
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${baseUrl}/blog/${canonicalSlug}">
    <meta property="og:site_name" content="Advanta AI">
    <meta property="article:published_time" content="${new Date(dateStr).toISOString()}">
    <meta property="article:section" content="${category.replace('_', ' ')}">
    ${tags.map(tag => `<meta property="article:tag" content="${tag}">`).join('\n    ')}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:site" content="@AdvantaAI">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${baseUrl}/blog/${canonicalSlug}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>
    
    <!-- Prefetch and Performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary-blue: #2563eb;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --background: #ffffff;
            --border: #e5e7eb;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: var(--text-primary);
            background: var(--background);
            font-size: 16px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .article-header {
            margin-bottom: 2rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.5rem;
        }
        
        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary-blue);
            margin-bottom: 1rem;
            line-height: 1.2;
        }
        
        .meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: center;
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .tag {
            background: #eff6ff;
            color: var(--primary-blue);
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            text-decoration: none;
            transition: background-color 0.2s;
        }
        
        .tag:hover {
            background: #dbeafe;
        }
        
        .content h2 {
            font-size: 1.75rem;
            font-weight: 600;
            margin: 2rem 0 1rem 0;
            color: var(--text-primary);
        }
        
        .content h3 {
            font-size: 1.375rem;
            font-weight: 500;
            margin: 1.5rem 0 0.75rem 0;
            color: var(--text-primary);
        }
        
        .content p {
            margin-bottom: 1.25rem;
            line-height: 1.7;
        }
        
        .content ul, .content ol {
            margin: 1rem 0 1.25rem 1.5rem;
        }
        
        .content li {
            margin-bottom: 0.5rem;
        }
        
        .content blockquote {
            border-left: 4px solid var(--primary-blue);
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: var(--text-secondary);
        }
        
        .cta-section {
            margin-top: 3rem;
            padding: 2rem;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            text-align: center;
            border: 1px solid var(--border);
        }
        
        .cta-section h3 {
            color: var(--primary-blue);
            margin-bottom: 0.75rem;
        }
        
        .cta-section p {
            margin-bottom: 1.5rem;
            color: var(--text-secondary);
        }
        
        .cta-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--primary-blue);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        .cta-button:hover {
            background: #1d4ed8;
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .container { padding: 1rem; }
            h1 { font-size: 2rem; }
            .meta { font-size: 0.8rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <article>
            <header class="article-header">
                <h1>${title}</h1>
                <div class="meta">
                    <span class="meta-item">📅 ${new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span class="meta-item">📂 ${category.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())}</span>
                    <span class="meta-item">⏱️ ${readingTime} min read</span>
                </div>
                ${tags.length ? `
                <div class="tags">
                    ${tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                ` : ''}
            </header>
            
            <div class="content">
                ${bodyHtml.replace('<h1>' + title + '</h1>', '')}
            </div>
            
            <div class="cta-section">
                <h3>Ready to Transform Your Business with AI?</h3>
                <p>Discover how Advanta AI can help you implement these solutions in days, not months.</p>
                <a href="${baseUrl}/contact" class="cta-button">
                    <span>Get Started Today</span>
                    <span>→</span>
                </a>
            </div>
        </article>
    </div>
    
    <!-- View tracking -->
    <script>
        // Track page view
        fetch('/api/enhanced-blog/view/${canonicalSlug}', { method: 'POST' })
          .catch(err => console.log('View tracking failed:', err));
    </script>
</body>
</html>`;
}

// Enhanced blog content generation with quality gates
export async function generateEnhancedBlogPost(): Promise<void> {
  return withRetry(async () => {
    blogLog.generation.start();
    
    // Select a random topic
    const randomTopic = enhancedBlogTopics[Math.floor(Math.random() * enhancedBlogTopics.length)];
    const { topic, category } = randomTopic;
    
    logGeneration('enhanced-post', 'start', `Generating: ${topic}`, { category });
    
    try {
      // Generate content with enhanced prompt
      const prompt = `
You are a professional AI and business strategy writer for Advanta AI, a leading AI consultancy that delivers enterprise-grade AI solutions in 7 days instead of 6+ months.

Generate a comprehensive, SEO-optimized blog post on: "${topic}"

**Advanta AI Core Value Propositions:**
• Speed: Implement AI solutions in days, not months
• Expertise: Enterprise-grade AI consulting and development
• Results: Proven ROI through intelligent automation
• Integration: Seamless connection with existing business systems
• Support: Ongoing optimization and analytics

**Content Requirements:**
- Target: Business leaders, digital marketers, entrepreneurs, SaaS builders
- Length: 1,200-1,800 words
- Tone: Professional, educational, actionable, results-focused
- Include 3-4 specific examples or case studies
- Focus on practical implementation and ROI
- Naturally mention Advanta AI's 7-day implementation advantage

**Structure:**
TITLE: [SEO-optimized, compelling title]

CATEGORY: ${category}

CONTENT:
[Hook introduction with value proposition]

## The Current Challenge
[Problem identification with specific pain points]

## AI-Powered Solutions
[Detailed solutions with implementation examples]

## Implementation Strategy
[Step-by-step approach with timelines]

## ROI and Business Impact
[Measurable benefits and success metrics]

## Getting Started: The Advanta AI Advantage
[Call-to-action focused on speed of implementation]

Ensure the content is actionable, includes specific examples, and positions AI as a practical business tool rather than futuristic technology.
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000,
        temperature: 0.7,
      });

      const fullContent = completion.choices[0]?.message?.content || '';
      const tokensUsed = completion.usage?.total_tokens || 0;
      trackAPIUsage(tokensUsed);

      // Parse the response
      const titleMatch = fullContent.match(/TITLE:\s*(.+)/);
      const contentMatch = fullContent.match(/CONTENT:\s*([\s\S]+)/);
      
      if (!titleMatch || !contentMatch) {
        throw new Error('Failed to parse generated content structure');
      }

      const title = titleMatch[1].trim();
      let content = contentMatch[1].trim();
      
      // Clean up content
      content = content.replace(/^```html\\s*/i, '').replace(/\\s*```$/, '');
      content = content.replace(/^```\\s*/, '').replace(/\\s*```$/, '');
      
      // Convert markdown to HTML
      content = convertMarkdownToHtml(content);
      
      // Generate enhanced tags
      const tags = generateEnhancedTags(content, category);
      
      // Run quality gates
      const qualityResult = await runQualityGates(content, content);
      if (!qualityResult.passed) {
        log.warn({ 
          title, 
          errors: qualityResult.errors, 
          warnings: qualityResult.warnings 
        }, 'Quality gates failed but continuing');
      }
      
      // Create file
      const date = new Date().toISOString().split('T')[0];
      const slug = slugify(title);
      const filename = `${date}-${slug}.html`;
      const filepath = path.join(process.cwd(), 'posts', filename);
      
      // Ensure posts directory exists
      const postsDir = path.join(process.cwd(), 'posts');
      if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
      }
      
      // Create enhanced HTML
      const description = content.substring(0, 160).replace(/<[^>]*>/g, '') + '...';
      const htmlContent = createEnhancedHtmlTemplate({
        title,
        description,
        category,
        tags,
        bodyHtml: content,
        canonicalSlug: slug,
        dateStr: date
      });
      
      // Save file
      fs.writeFileSync(filepath, htmlContent, 'utf8');
      
      // Share to social platforms (non-blocking)
      shareToAllPlatforms(title, slug).catch(error => {
        log.error({ error: error?.message || String(error), slug }, 'Social sharing failed');
      });
      
      // Update RSS and sitemap (non-blocking)
      buildRSSandSitemap().catch(error => {
        log.error({ error: error?.message || String(error) }, 'RSS/sitemap update failed');
      });
      
      logGeneration('enhanced-post', 'success', `Generated: ${title}`, {
        filename,
        category,
        tags,
        wordCount: content.split(' ').length,
        tokensUsed,
        qualityScore: qualityResult.passed ? 'passed' : 'warnings'
      });
      
      blogLog.generation.success(slug, { 
        title, 
        category, 
        tags, 
        tokensUsed,
        filename 
      });
      
    } catch (error: any) {
      logGeneration('enhanced-post', 'error', error?.message || String(error), { topic, category });
      blogLog.generation.error(error, { topic, category });
      throw error;
    }
  }, 'enhanced-blog-generation', 2);
}

// Helper function to convert markdown to HTML
function convertMarkdownToHtml(content: string): string {
  // Convert markdown headings to HTML
  content = content.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  content = content.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  
  // Convert markdown bold to HTML
  content = content.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
  
  // Convert markdown italic to HTML
  content = content.replace(/\\*(.+?)\\*/g, '<em>$1</em>');
  
  // Convert bullet points
  content = content.replace(/^[-•]\\s+(.+)$/gm, '<li>$1</li>');
  content = content.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  content = content.replace(/<\/ul>\\s*<ul>/g, '');
  
  // Convert line breaks to paragraphs
  const paragraphs = content.split('\\n\\n');
  content = paragraphs.map(p => {
    p = p.trim();
    if (p.startsWith('<h2>') || p.startsWith('<h3>') || p.startsWith('<ul>')) {
      return p;
    }
    return p ? `<p>${p}</p>` : '';
  }).filter(p => p).join('\\n\\n');
  
  return content;
}

// Helper function to create URL-friendly slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/[\\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}