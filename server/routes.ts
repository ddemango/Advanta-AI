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
  // API route for contact form submissions
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
      
      // Save to database
      await storage.createContactSubmission({
        name: formData.name,
        email: formData.email, 
        company: formData.company,
        industry: formData.industry,
        message: formData.message,
        consent: formData.consent
      });
      
      // Return success response
      return res.status(200).json({ 
        message: 'Contact form submitted successfully',
        success: true
      });
    } catch (error) {
      console.error('Error processing contact form:', error);
      return res.status(500).json({ message: 'Server error processing your request' });
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

  const httpServer = createServer(app);

  return httpServer;
}
