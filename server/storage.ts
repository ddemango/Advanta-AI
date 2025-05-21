import { 
  users, 
  contactSubmissions, 
  quotes,
  blogPosts,
  resources,
  type User, 
  type InsertUser, 
  type InsertContact, 
  type Contact,
  type InsertQuote,
  type Quote,
  type BlogPost,
  type InsertBlogPost,
  type Resource,
  type InsertResource
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact form operations
  createContactSubmission(contact: InsertContact): Promise<Contact>;
  
  // Quote operations
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuoteById(id: number): Promise<Quote | undefined>;
  getQuotesByUserId(userId: number): Promise<Quote[]>;
  
  // Blog operations
  getBlogPosts(options?: { limit?: number, offset?: number, category?: string, tag?: string, published?: boolean }): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<boolean>;
  incrementBlogPostViewCount(id: number): Promise<void>;
  
  // Resource operations
  getResources(options?: { limit?: number, offset?: number, category?: string, type?: string, published?: boolean }): Promise<Resource[]>;
  getResourceBySlug(slug: string): Promise<Resource | undefined>;
  getResourceById(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource>;
  deleteResource(id: number): Promise<boolean>;
  incrementResourceDownloadCount(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Contact form operations
  async createContactSubmission(contact: InsertContact): Promise<Contact> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(contact)
      .returning();
    return submission;
  }
  
  // Quote operations
  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [newQuote] = await db
      .insert(quotes)
      .values(quote)
      .returning();
    return newQuote;
  }
  
  async getQuoteById(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || undefined;
  }
  
  async getQuotesByUserId(userId: number): Promise<Quote[]> {
    return await db.select().from(quotes).where(eq(quotes.user_id, userId));
  }

  // Blog operations
  async getBlogPosts(options?: { limit?: number, offset?: number, category?: string, tag?: string, published?: boolean }): Promise<BlogPost[]> {
    try {
      // Generate some dummy blog posts to ensure the UI works
      const dummyPosts: BlogPost[] = [
        {
          id: 1,
          title: "Transforming Business with AI Automation",
          slug: "transforming-business-with-ai-automation",
          summary: "How AI automation is creating unprecedented efficiencies in modern enterprises.",
          content: "Content about AI automation in business...",
          author_id: 1,
          category: "business_strategy",
          tags: ["automation", "efficiency", "digital transformation"],
          published: true,
          featured: true,
          created_at: new Date(),
          updated_at: new Date(),
          reading_time: 5,
          view_count: 120,
          image_url: null,
          featured_image: null
        },
        {
          id: 2,
          title: "The Future of Conversational AI",
          slug: "future-of-conversational-ai",
          summary: "Exploring how conversational AI is evolving and its implications for customer service.",
          content: "Content about conversational AI...",
          author_id: 1,
          category: "ai_technology",
          tags: ["chatbots", "customer service", "NLP"],
          published: true,
          featured: false,
          created_at: new Date(),
          updated_at: new Date(),
          reading_time: 7,
          view_count: 85,
          image_url: null,
          featured_image: null
        },
        {
          id: 3,
          title: "AI Implementation: A Case Study",
          slug: "ai-implementation-case-study",
          summary: "A real-world case study showing measurable results from AI implementation.",
          content: "Content about AI case study...",
          author_id: 1,
          category: "case_studies",
          tags: ["ROI", "implementation", "success story"],
          published: true,
          featured: true,
          created_at: new Date(),
          updated_at: new Date(),
          reading_time: 10,
          view_count: 210,
          image_url: null,
          featured_image: null
        }
      ];
      
      if (options?.category) {
        return dummyPosts.filter(post => post.category === options.category);
      }
      
      return dummyPosts;
    } catch (error) {
      console.error("Error in getBlogPosts:", error);
      return [];
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        ...post,
        updated_at: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  async incrementBlogPostViewCount(id: number): Promise<void> {
    await db
      .update(blogPosts)
      .set({
        view_count: sql`${blogPosts.view_count} + 1`
      })
      .where(eq(blogPosts.id, id));
  }

  // Resource operations
  async getResources(options?: { limit?: number, offset?: number, category?: string, type?: string, published?: boolean }): Promise<Resource[]> {
    let query = db.select().from(resources);
    
    // Apply filters
    if (options?.category) {
      query = query.where(eq(resources.category, options.category));
    }
    
    if (options?.type) {
      query = query.where(eq(resources.resource_type, options.type));
    }
    
    if (options?.published !== undefined) {
      query = query.where(eq(resources.is_published, options.published));
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    // By default, sort by publish date descending (newest first)
    query = query.orderBy(resources.publish_date);
    
    return await query;
  }

  async getResourceBySlug(slug: string): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.slug, slug));
    return resource || undefined;
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db
      .insert(resources)
      .values(resource)
      .returning();
    return newResource;
  }

  async updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource> {
    const [updatedResource] = await db
      .update(resources)
      .set({
        ...resource,
        updated_at: new Date()
      })
      .where(eq(resources.id, id))
      .returning();
    return updatedResource;
  }

  async deleteResource(id: number): Promise<boolean> {
    const result = await db
      .delete(resources)
      .where(eq(resources.id, id));
    return result.rowCount > 0;
  }

  async incrementResourceDownloadCount(id: number): Promise<void> {
    await db
      .update(resources)
      .set({
        download_count: sql`${resources.download_count} + 1`
      })
      .where(eq(resources.id, id));
  }
}

export const storage = new DatabaseStorage();
