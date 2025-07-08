import OpenAI from "openai";
import { db } from "./db";
import { blogPosts } from "@shared/schema";
import { InsertBlogPost } from "@shared/schema";
import { sql, eq } from "drizzle-orm";
import { slugify } from "./utils";
import { log } from "./vite";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Blog topics by category focused on Advanta AI services
const blogTopics = {
  ai_technology: [
    "How Advanta AI's custom GPT agents transform enterprise customer service",
    "Leveraging neural networks with Advanta AI's proprietary algorithms",
    "The power of NLP in Advanta AI's custom enterprise solutions",
    "Advanta AI's computer vision innovations for business efficiency",
    "Compare and contrast: How Advanta AI optimizes different LLM models for your business",
    "Inside Advanta AI's proprietary model training techniques for business data",
    "Multimodal AI at Advanta: Combining vision, text, and audio for business insights",
    "Edge AI deployment: How Advanta AI delivers powerful solutions without cloud dependencies",
    "Advanta AI's inference optimization techniques for cost-effective business solutions",
    "Enterprise-grade AI infrastructure: The Advanta AI technical advantage",
  ],
  business_strategy: [
    "The Advanta AI transformation roadmap: From legacy systems to AI excellence",
    "Building AI governance frameworks with Advanta AI's best practices",
    "Measuring ROI on Advanta AI solutions: Real metrics that matter",
    "Advanta AI's readiness assessment process for new enterprise clients",
    "Change management best practices when implementing Advanta AI solutions",
    "How to build cross-functional teams to maximize your Advanta AI implementation",
    "Ethical AI guidelines in practice: Advanta AI's responsible business approach",
    "Process optimization with Advanta AI: Our proven framework for results",
    "Creating an AI center of excellence with Advanta AI's enterprise platform",
    "Competitive advantage strategies: How Advanta AI transforms market positioning",
  ],
  case_studies: [
    "How Advanta AI saved a Fortune 500 company $2M annually through custom automation",
    "Transforming customer support with Advanta AI's intelligent chatbot solutions",
    "Predictive maintenance success: How Advanta AI reduced downtime by 35%",
    "Document processing transformation: Advanta AI's solution for legal firms",
    "Healthcare efficiency: 40% boost in patient processing with Advanta AI",
    "Financial services case study: Advanta AI's market prediction platform",
    "Retail revolution: How Advanta AI's recommendation engine increased conversions by 28%",
    "Logistics optimization: 15% cost reduction with Advanta AI's routing algorithms",
    "HR transformation: Advanta AI's recruitment solution reduces hiring time by 35%",
    "Small business success: Implementing Advanta AI solutions on a limited budget",
  ],
  tutorials: [
    "Getting started with Advanta AI: Your first custom model implementation",
    "Implementing AI governance with Advanta AI's enterprise framework",
    "Building your first Advanta AI chatbot: A step-by-step guide",
    "Integrating Advanta AI with legacy systems: Best practices and approaches",
    "Prompt engineering mastery with Advanta AI's custom assistants",
    "Setting up secure endpoints with Advanta AI's enterprise platform",
    "Data preparation for Advanta AI model training: Best practices guide",
    "Fine-tuning Advanta AI models for your specific business domain",
    "Evaluating AI model performance with Advanta AI's analytics dashboard",
    "Advanta AI project management: Our version control and collaboration tools",
  ],
  industry_insights: [
    "2025 AI trends: How Advanta AI is shaping manufacturing innovation",
    "Financial risk assessment transformation with Advanta AI solutions",
    "Healthcare AI: How Advanta AI is overcoming industry barriers",
    "Legal AI adoption: Advanta AI's specialized solutions for law firms",
    "Retail intelligence: How Advanta AI is transforming the customer experience",
    "Supply chain optimization with Advanta AI's predictive analytics",
    "Professional services evolution: Advanta AI's impact on consulting firms",
    "Customer experience revolution: Advanta AI's omnichannel strategy",
    "Regulatory compliance: How Advanta AI ensures AI governance in regulated industries",
    "Real estate and construction: Emerging applications of Advanta AI solutions",
  ],
  news: [
    "Advanta AI announces strategic partnership with leading cloud provider",
    "Advanta AI acquires specialized NLP startup to enhance language capabilities",
    "New AI regulations: How Advanta AI ensures compliance for all clients",
    "Advanta AI research team publishes breakthrough paper on efficiency optimization",
    "Upcoming webinar: Advanta AI to showcase new enterprise solutions",
    "Breakthrough: Advanta AI reduces model training costs by 40% with new architecture",
    "Investment update: Advanta AI secures new funding to expand enterprise offerings",
    "Product launch: Advanta AI introduces new enterprise platform with enhanced security",
    "Startup collaboration: Advanta AI partners with emerging tech innovators",
    "Security focus: Advanta AI's proactive approach to AI vulnerability management",
  ],
  resources: [
    "Advanta AI's recommended reading list for business leaders exploring AI",
    "Executive training: Advanta AI's specialized programs for leadership teams",
    "Free tools: Complementary solutions that work with Advanta AI's platform",
    "Implementation templates: Advanta AI's process frameworks for business transformation",
    "Project management guide: Successfully delivering Advanta AI initiatives",
    "Vendor selection framework: Why Advanta AI stands apart from competitors",
    "Decision-making toolkit: Evaluating AI opportunities with Advanta AI's methodology",
    "Building your business case: Advanta AI's ROI calculation templates",
    "Investment planning: Advanta AI's phased approach to enterprise implementation",
    "Stay informed: Subscribing to Advanta AI's resource hub and newsletter",
  ],
};

// Generate random author ID (in production you would have real authors)
const authorIds = [1, 2, 3]; // Assuming these are valid user IDs in your database

// Generate a blog post using OpenAI
async function generateBlogPost(category: keyof typeof blogTopics): Promise<InsertBlogPost> {
  // Get a random topic from the category
  const topics = blogTopics[category];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  
  try {
    log(`Generating blog post on topic: ${topic} (Category: ${category})`, "auto-blog");
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Advanta AI's in-house content specialist.
          You write engaging, informative blog posts about AI solutions for enterprise clients.
          Format your response with appropriate HTML tags for headings (h2, h3), paragraphs (p), lists (ul, li), etc.
          Include a short summary of 2-3 sentences at the beginning that captures the essence of the article.
          The blog post should be about 800-1000 words.
          Write in a professional, authoritative tone but make complex concepts accessible.
          Include practical business applications and actionable insights.
          Do not use made-up statistics or studies - if including data, keep it general/industry-accepted.
          Highlight Advanta AI's unique approach to enterprise AI solutions and mention our competitive advantages.
          Use forward-looking language that emphasizes transformation, innovation, and measurable business outcomes.`
        },
        {
          role: "user",
          content: `Create a comprehensive blog post on the topic: "${topic}".
          The blog post should have:
          1. An engaging title that includes relevant keywords
          2. A brief summary (2-3 sentences)
          3. An introduction that hooks the reader
          4. 3-4 main sections with appropriate subheadings
          5. Practical business applications and insights specific to Advanta AI's offerings
          6. A conclusion with key takeaways and a subtle call to action
          
          Our services include:
          - Custom AI agent development
          - Enterprise AI integration
          - Industry-specific AI solutions
          - AI strategy consultation
          - Proprietary AI model fine-tuning
          - AI analytics dashboards
          - Workflow optimization with AI
          
          Target audience is business leaders and technology decision-makers.
          Category: ${category}`
        }
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });
    
    // Extract content from response
    const content = response.choices[0].message.content?.trim() || "";
    
    // Extract title from content (assuming it's wrapped in h1 or at the beginning)
    const titleMatch = content.match(/<h1>(.*?)<\/h1>/) || content.match(/^#\s+(.*?)\n/) || content.split('\n')[0];
    const title = titleMatch ? titleMatch[1] || titleMatch[0] : topic;
    
    // Extract or generate summary
    const summaryMatch = content.match(/<summary>(.*?)<\/summary>/) || 
                          content.match(/<p><em>(.*?)<\/em><\/p>/);
    let summary = "";
    
    if (summaryMatch && summaryMatch[1]) {
      summary = summaryMatch[1];
    } else {
      // If no summary found, generate one
      const summaryResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Write a concise 2-3 sentence summary of the following blog post:"
          },
          {
            role: "user",
            content: content
          }
        ],
        max_tokens: 150,
        temperature: 0.5,
      });
      
      summary = summaryResponse.choices[0].message.content?.trim() || "";
    }
    
    // Generate tags
    const tagsResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate 5-7 relevant tags for the following blog post title and summary. Return only the tags as a JSON array of strings:"
        },
        {
          role: "user",
          content: `Title: ${title}\nSummary: ${summary}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 100,
      temperature: 0.5,
    });
    
    let tags = [];
    try {
      const tagsObj = JSON.parse(tagsResponse.choices[0].message.content || "{}");
      tags = Array.isArray(tagsObj.tags) ? tagsObj.tags : [];
    } catch (e) {
      log(`Error parsing tags: ${e}`, "auto-blog");
      tags = [];
    }
    
    // Generate slug from title
    const slug = slugify(title);
    
    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Random author ID
    const authorId = authorIds[Math.floor(Math.random() * authorIds.length)];
    
    // Current date
    const now = new Date();
    
    // Create blog post object
    const blogPost: InsertBlogPost = {
      title,
      slug,
      summary: summary || 'A comprehensive guide to AI solutions for enterprise clients.',
      content,
      authorId: authorId,
      category: category,
      tags,
      imageUrl: `https://source.unsplash.com/random/1200x630/?${encodeURIComponent(category + "," + title.split(" ")[0])}`,
      featuredImage: `https://source.unsplash.com/random/1200x630/?${encodeURIComponent(category + "," + title.split(" ")[0])}`,
      readingTime: readingTime,
      published: true,
      featured: Math.random() > 0.7, // 30% chance of being featured
    };
    
    return blogPost;
  } catch (error) {
    log(`Error generating blog post: ${error}`, "auto-blog");
    throw error;
  }
}

// Check if slug already exists
async function slugExists(slug: string): Promise<boolean> {
  const result = await db.select({ id: blogPosts.id })
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  
  return result.length > 0;
}

// Generate new blog post and save to database
export async function generateAndSaveBlogPost(): Promise<void> {
  try {
    // Get random category
    const categories = Object.keys(blogTopics) as Array<keyof typeof blogTopics>;
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Generate blog post
    const blogPost = await generateBlogPost(category);
    
    // Check if slug already exists
    if (await slugExists(blogPost.slug)) {
      // Append random string to make slug unique
      const randomString = Math.random().toString(36).substring(2, 7);
      blogPost.slug = `${blogPost.slug}-${randomString}`;
    }
    
    // Save to database
    await db.insert(blogPosts).values(blogPost);
    
    log(`Successfully generated and saved blog post: ${blogPost.title}`, "auto-blog");
  } catch (error) {
    log(`Error in generateAndSaveBlogPost: ${error}`, "auto-blog");
  }
}

// Generate multiple blog posts
export async function generateMultipleBlogPosts(count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    try {
      await generateAndSaveBlogPost();
      // Sleep between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      log(`Error generating blog post ${i}: ${error}`, "auto-blog");
    }
  }
}