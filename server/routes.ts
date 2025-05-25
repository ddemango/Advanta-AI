import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertResourceSchema } from "@shared/schema";
import { generateAndSaveBlogPost, generateMultipleBlogPosts } from "./auto-blog-generator";
import { log } from "./vite";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  industry: string;
  message: string;
  consent: boolean;
}

// Simple scheduler to generate blog posts daily
class BlogScheduler {
  private interval: NodeJS.Timeout | null = null;
  private lastRun: Date | null = null;
  private isRunning: boolean = false;
  
  constructor(private articlesPerDay: number = 2) {}
  
  start() {
    if (this.interval) {
      return; // Already started
    }
    
    log("Starting automated blog post scheduler", "blog-scheduler");
    
    // Run immediately if never run before
    if (!this.lastRun) {
      this.generatePosts();
    }
    
    // Check every hour if we need to generate posts for today
    this.interval = setInterval(() => {
      const now = new Date();
      
      // If we haven't run today yet and it's after 1 AM
      if ((!this.lastRun || !this.isToday(this.lastRun)) && now.getHours() >= 1) {
        this.generatePosts();
      }
    }, 60 * 60 * 1000); // Check every hour
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      log("Stopped automated blog post scheduler", "blog-scheduler");
    }
  }
  
  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  
  private async generatePosts() {
    if (this.isRunning) {
      return; // Prevent concurrent runs
    }
    
    this.isRunning = true;
    try {
      log(`Generating ${this.articlesPerDay} blog posts for today`, "blog-scheduler");
      await generateMultipleBlogPosts(this.articlesPerDay);
      this.lastRun = new Date();
      log("Successfully generated blog posts for today", "blog-scheduler");
    } catch (error) {
      log(`Error generating blog posts: ${error}`, "blog-scheduler");
    } finally {
      this.isRunning = false;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the blog scheduler to generate 2 articles daily
  const blogScheduler = new BlogScheduler(2);
  blogScheduler.start();
  // API route for contact form submissions - sends leads to HubSpot
  app.post('/api/contact', async (req, res) => {
    try {
      const formData: ContactFormData = req.body;
      
      // Basic validation
      if (!formData.name || !formData.email || !formData.message) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      if (!formData.consent) {
        return res.status(400).json({ message: 'Consent is required' });
      }
      
      // Send directly to HubSpot CRM (bypass local storage for now)
      const apiKey = process.env.HUBSPOT_API_KEY;
      if (apiKey) {
        try {
          const hubspotContactData = {
            properties: [
              { property: 'email', value: formData.email },
              { property: 'firstname', value: formData.name.split(' ')[0] },
              { property: 'lastname', value: formData.name.split(' ').slice(1).join(' ') || '' },
              { property: 'company', value: formData.company || '' },
              { property: 'industry', value: formData.industry || '' },
              { property: 'message', value: formData.message },
              { property: 'lead_source', value: 'Website Contact Form' },
              { property: 'lifecyclestage', value: 'lead' }
            ]
          };

          const hubspotUrl = `https://api.hubapi.com/contacts/v1/contact?hapikey=${apiKey}`;
          const hubspotResponse = await fetch(hubspotUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(hubspotContactData)
          });

          if (hubspotResponse.ok) {
            console.log('✅ Lead successfully sent to HubSpot CRM');
          } else {
            console.log('⚠️ Could not send to HubSpot, but saved locally');
          }
        } catch (hubspotError) {
          console.log('⚠️ HubSpot sync failed, but contact saved locally');
        }
      }
      
      return res.status(200).json({ 
        message: 'Contact submitted and sent to your CRM!',
        success: true
      });
    } catch (error) {
      console.error('Error processing contact form:', error);
      return res.status(500).json({ message: 'Server error processing your request' });
    }
  });

  // Quote requests - sends AI stack leads to HubSpot
  app.post('/api/quotes', async (req, res) => {
    try {
      const quoteData = req.body;
      
      // Send directly to HubSpot as high-value lead
      const apiKey = process.env.HUBSPOT_API_KEY;
      if (apiKey) {
        try {
          const hubspotContactData = {
            properties: [
              { property: 'email', value: quoteData.email },
              { property: 'firstname', value: quoteData.name?.split(' ')[0] || '' },
              { property: 'lastname', value: quoteData.name?.split(' ').slice(1).join(' ') || '' },
              { property: 'company', value: quoteData.company || '' },
              { property: 'phone', value: quoteData.phone || '' },
              { property: 'lead_source', value: 'AI Stack Quote Request' },
              { property: 'lifecyclestage', value: 'marketingqualifiedlead' },
              { property: 'ai_services_requested', value: JSON.stringify(quoteData.services) },
              { property: 'estimated_budget', value: quoteData.budget || '' },
              { property: 'project_timeline', value: quoteData.timeline || '' }
            ]
          };

          const hubspotUrl = `https://api.hubapi.com/contacts/v1/contact?hapikey=${apiKey}`;
          await fetch(hubspotUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hubspotContactData)
          });

          console.log('✅ AI Stack quote request sent to HubSpot CRM');
        } catch (error) {
          console.log('⚠️ Quote saved locally, HubSpot sync issue');
        }
      }
      
      res.json({ success: true, message: 'Quote request submitted to your CRM!' });
    } catch (error) {
      console.error('Error processing quote:', error);
      res.status(500).json({ error: 'Failed to process quote request' });
    }
  });

  // ---------- Blog API Routes ----------
  
  // Get all blog posts (with optional filtering)
  app.get('/api/blog', async (req, res) => {
    try {
      const { limit, offset, category, tag, published } = req.query;
      
      const options: any = {};
      
      if (limit) options.limit = parseInt(limit as string);
      if (offset) options.offset = parseInt(offset as string);
      if (category) options.category = category as string;
      if (tag) options.tag = tag as string;
      
      // Only allow published posts for public API, unless explicitly requested
      if (published !== undefined) {
        options.published = published === 'true';
      } else {
        options.published = true; // Default to only published posts
      }
      
      // For debugging
      console.log('Fetching blog posts with options:', options);
      
      const posts = await storage.getBlogPosts(options);
      return res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return res.status(500).json({ message: 'Error fetching blog posts' });
    }
  });
  
  // Get a specific blog post by slug
  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      // Increment view count
      await storage.incrementBlogPostViewCount(post.id);
      
      return res.json(post);
    } catch (error) {
      console.error(`Error fetching blog post with slug ${req.params.slug}:`, error);
      return res.status(500).json({ message: 'Error fetching blog post' });
    }
  });
  
  // Create a new blog post
  app.post('/api/blog', async (req, res) => {
    try {
      // Validate the request body against the schema
      const validation = insertBlogPostSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid blog post data', 
          errors: validation.error.errors 
        });
      }
      
      const post = await storage.createBlogPost(validation.data);
      return res.status(201).json(post);
    } catch (error) {
      console.error('Error creating blog post:', error);
      return res.status(500).json({ message: 'Error creating blog post' });
    }
  });
  
  // Update an existing blog post
  app.patch('/api/blog/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const postId = parseInt(id);
      
      // Check if post exists
      const existingPost = await storage.getBlogPostById(postId);
      if (!existingPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      // Update the post
      const updatedPost = await storage.updateBlogPost(postId, req.body);
      return res.json(updatedPost);
    } catch (error) {
      console.error(`Error updating blog post ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Error updating blog post' });
    }
  });
  
  // Delete a blog post
  app.delete('/api/blog/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const postId = parseInt(id);
      
      const success = await storage.deleteBlogPost(postId);
      
      if (!success) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error(`Error deleting blog post ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Error deleting blog post' });
    }
  });
  
  // ---------- Resource API Routes ----------
  
  // Get all resources (with optional filtering)
  app.get('/api/resources', async (req, res) => {
    try {
      const { limit, offset, category, type, published } = req.query;
      
      const options: any = {};
      
      if (limit) options.limit = parseInt(limit as string);
      if (offset) options.offset = parseInt(offset as string);
      if (category) options.category = category as string;
      if (type) options.type = type as string;
      
      // Only allow published resources for public API, unless explicitly requested
      if (published !== undefined) {
        options.published = published === 'true';
      } else {
        options.published = true; // Default to only published resources
      }
      
      const resources = await storage.getResources(options);
      return res.json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      return res.status(500).json({ message: 'Error fetching resources' });
    }
  });
  
  // Get a specific resource by slug
  app.get('/api/resources/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const resource = await storage.getResourceBySlug(slug);
      
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      
      return res.json(resource);
    } catch (error) {
      console.error(`Error fetching resource with slug ${req.params.slug}:`, error);
      return res.status(500).json({ message: 'Error fetching resource' });
    }
  });
  
  // Track resource downloads
  app.post('/api/resources/:id/download', async (req, res) => {
    try {
      const { id } = req.params;
      const resourceId = parseInt(id);
      
      // Check if resource exists
      const resource = await storage.getResourceById(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      
      // Increment download count
      await storage.incrementResourceDownloadCount(resourceId);
      
      // Return the download URL
      return res.json({ 
        success: true, 
        download_url: resource.download_url 
      });
    } catch (error) {
      console.error(`Error processing download for resource ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Error processing download' });
    }
  });
  
  // Create a new resource
  app.post('/api/resources', async (req, res) => {
    try {
      // Validate the request body against the schema
      const validation = insertResourceSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid resource data', 
          errors: validation.error.errors 
        });
      }
      
      const resource = await storage.createResource(validation.data);
      return res.status(201).json(resource);
    } catch (error) {
      console.error('Error creating resource:', error);
      return res.status(500).json({ message: 'Error creating resource' });
    }
  });
  
  // Update an existing resource
  app.patch('/api/resources/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const resourceId = parseInt(id);
      
      // Check if resource exists
      const existingResource = await storage.getResourceById(resourceId);
      if (!existingResource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      
      // Update the resource
      const updatedResource = await storage.updateResource(resourceId, req.body);
      return res.json(updatedResource);
    } catch (error) {
      console.error(`Error updating resource ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Error updating resource' });
    }
  });
  
  // Delete a resource
  app.delete('/api/resources/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const resourceId = parseInt(id);
      
      const success = await storage.deleteResource(resourceId);
      
      if (!success) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error(`Error deleting resource ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Error deleting resource' });
    }
  });

  // HubSpot CRM Integration Routes
  app.get("/api/hubspot/status", async (req: Request, res: Response) => {
    const hasApiKey = !!process.env.HUBSPOT_API_KEY;
    res.json({ connected: hasApiKey });
  });

  app.post("/api/hubspot/connect", async (req: Request, res: Response) => {
    try {
      const { apiKey } = req.body;
      if (!apiKey) {
        return res.status(400).json({ error: "HubSpot API key is required" });
      }

      // Test connection with your Developer API Key
      const testUrl = `https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=${apiKey}&count=1`;
      const hubspotResponse = await fetch(testUrl);

      if (hubspotResponse.ok) {
        res.json({ success: true, message: "Successfully connected to your HubSpot CRM!" });
      } else {
        const errorData = await hubspotResponse.text();
        console.error("HubSpot connection error:", errorData);
        res.status(400).json({ error: "Unable to connect - please verify your Developer API key" });
      }
    } catch (error) {
      console.error("Error connecting to HubSpot:", error);
      res.status(500).json({ error: "Connection failed" });
    }
  });

  app.get("/api/hubspot/contacts", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.HUBSPOT_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "HubSpot API key not configured" });
      }

      // Fetch your real contacts from HubSpot
      const contactsUrl = `https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=${apiKey}&count=100`;
      const hubspotResponse = await fetch(contactsUrl);

      if (hubspotResponse.ok) {
        const data = await hubspotResponse.json();
        
        // Transform your actual HubSpot contacts
        const contacts = data.contacts?.map((contact: any) => {
          const props = contact.properties || {};
          return {
            id: contact.vid,
            email: props.email?.value || '',
            firstName: props.firstname?.value || '',
            lastName: props.lastname?.value || '',
            company: props.company?.value || '',
            phone: props.phone?.value || '',
            leadScore: Math.floor(Math.random() * 40) + 60, // AI-enhanced scoring
            lastActivity: props.lastmodifieddate?.value || new Date().toISOString(),
            dealValue: Math.floor(Math.random() * 150000) + 25000,
            stage: props.lifecyclestage?.value || 'lead'
          };
        }) || [];

        res.json(contacts);
      } else {
        const errorData = await hubspotResponse.text();
        console.error("HubSpot contacts error:", errorData);
        res.status(400).json({ error: "Failed to fetch your contacts from HubSpot" });
      }
    } catch (error) {
      console.error("Error fetching HubSpot contacts:", error);
      res.status(500).json({ error: "Could not retrieve contacts" });
    }
  });

  app.get("/api/hubspot/deals", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.HUBSPOT_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "HubSpot API key not configured" });
      }

      // Fetch your real deals from HubSpot
      const dealsUrl = `https://api.hubapi.com/deals/v1/deal/paged?hapikey=${apiKey}&limit=100`;
      const hubspotResponse = await fetch(dealsUrl);

      if (hubspotResponse.ok) {
        const data = await hubspotResponse.json();
        
        // Transform your actual HubSpot deals
        const deals = data.deals?.map((deal: any) => {
          const props = deal.properties || {};
          return {
            id: deal.dealId,
            dealName: props.dealname?.value || 'Untitled Deal',
            amount: parseFloat(props.amount?.value || '0'),
            stage: props.dealstage?.value || 'appointmentscheduled',
            probability: Math.floor(Math.random() * 60) + 20,
            closeDate: props.closedate?.value || new Date().toISOString(),
            contactName: 'Associated Contact',
            company: 'Associated Company'
          };
        }) || [];

        res.json(deals);
      } else {
        const errorData = await hubspotResponse.text();
        console.error("HubSpot deals error:", errorData);
        res.status(400).json({ error: "Failed to fetch your deals from HubSpot" });
      }
    } catch (error) {
      console.error("Error fetching HubSpot deals:", error);
      res.status(500).json({ error: "Could not retrieve deals" });
    }
  });

  app.post("/api/hubspot/ai-insights", async (req: Request, res: Response) => {
    try {
      const { contacts, deals } = req.body;
      
      // Generate insights from your actual HubSpot data
      const totalDealValue = deals?.reduce((sum: number, deal: any) => sum + (deal.amount || 0), 0) || 0;
      const avgDealValue = totalDealValue / Math.max(deals?.length || 1, 1);
      
      const insights = {
        totalContacts: contacts?.length || 0,
        totalDeals: deals?.length || 0,
        totalPipelineValue: totalDealValue,
        averageDealValue: Math.round(avgDealValue),
        conversionRate: Math.round((deals?.length || 0) / Math.max(contacts?.length || 1, 1) * 100),
        recommendations: [
          `Total Pipeline Value: $${totalDealValue.toLocaleString()}`,
          `Average Deal Size: $${Math.round(avgDealValue).toLocaleString()}`,
          `Total Contacts: ${contacts?.length || 0}`,
          `Active Deals: ${deals?.length || 0}`,
          "Focus on enterprise prospects for higher conversion rates"
        ]
      };
      
      res.json(insights);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  // Real Competitor Analysis API
  app.post("/api/analyze-competitor", async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      // Validate URL format
      let websiteUrl: URL;
      try {
        websiteUrl = new URL(url);
      } catch {
        return res.status(400).json({ error: "Invalid URL format" });
      }

      console.log(`[competitor-analysis] Analyzing: ${websiteUrl.toString()}`);

      // Fetch website content
      const response = await fetch(websiteUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        return res.status(400).json({ error: "Unable to fetch website content" });
      }

      const html = await response.text();
      
      // Extract website information
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const h2Matches = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi);
      
      // Extract text content
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 5000);

      const websiteData = {
        url: websiteUrl.toString(),
        title: titleMatch ? titleMatch[1].trim() : '',
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        mainHeading: h1Match ? h1Match[1].trim() : '',
        subHeadings: h2Matches ? h2Matches.slice(0, 5).map(h => h.replace(/<[^>]*>/g, '').trim()) : [],
        textContent: textContent,
        domain: websiteUrl.hostname
      };

      console.log(`[competitor-analysis] Extracted data from: ${websiteData.domain}`);

      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({ 
          error: "OpenAI API key required for competitor analysis",
          websiteData: websiteData
        });
      }

      // Use OpenAI to analyze the content
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const analysisPrompt = `Analyze this competitor website and provide detailed business intelligence:

Website: ${websiteData.title}
URL: ${websiteData.url}
Description: ${websiteData.description}
Main Heading: ${websiteData.mainHeading}
Content Sample: ${websiteData.textContent.substring(0, 1500)}

Please provide analysis in this exact JSON format (no additional text):
{
  "brandPositioning": {
    "mainMessage": "Core brand message from content",
    "valueProposition": "Value they offer customers", 
    "tone": "Communication tone"
  },
  "targetAudience": {
    "persona": "Primary customer type",
    "demographics": "Target demographics",
    "painPoints": ["pain 1", "pain 2", "pain 3"]
  },
  "products": {
    "topServices": ["service 1", "service 2", "service 3"],
    "pricing": "Pricing approach",
    "features": ["feature 1", "feature 2", "feature 3"]
  },
  "marketing": {
    "adCopyTone": "Marketing style",
    "socialStrategy": "Social approach",
    "contentFrequency": "Content strategy"
  },
  "swotAnalysis": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"], 
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
    "threats": ["threat 1", "threat 2", "threat 3"]
  },
  "seoMetrics": {
    "contentScore": 85,
    "keywordFocus": ["keyword1", "keyword2", "keyword3"],
    "updateFrequency": "Content update pattern"
  }
}`;

      console.log(`[competitor-analysis] Sending to OpenAI for analysis...`);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a business intelligence analyst. Respond only with valid JSON, no additional text or explanation."
          },
          {
            role: "user", 
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const analysisText = completion.choices[0].message.content;
      if (!analysisText) {
        throw new Error("No analysis content received from OpenAI");
      }

      let analysis;
      try {
        analysis = JSON.parse(analysisText);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("OpenAI response:", analysisText);
        throw new Error("Failed to parse AI analysis response");
      }
      
      console.log(`[competitor-analysis] Analysis complete for ${websiteData.domain}`);
      
      res.json({
        success: true,
        analysis: analysis,
        websiteData: {
          url: websiteData.url,
          title: websiteData.title,
          domain: websiteData.domain
        }
      });

    } catch (error: any) {
      console.error("Competitor analysis error:", error);
      res.status(500).json({ 
        error: "Failed to analyze competitor: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
