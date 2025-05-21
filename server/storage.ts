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
import { eq, sql } from "drizzle-orm";

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
    let selectQuery = db.select().from(blogPosts);
    
    // Apply filters
    const conditions = [];
    
    if (options?.category) {
      conditions.push(eq(blogPosts.category, options.category));
    }
    
    if (options?.published !== undefined) {
      conditions.push(eq(blogPosts.is_published, options.published));
    }
    
    // Apply tag filter if provided
    if (options?.tag) {
      conditions.push(sql`${blogPosts.tags}::jsonb @> ${JSON.stringify([options.tag])}::jsonb`);
    }
    
    // Apply all conditions if any exist
    if (conditions.length > 0) {
      for (const condition of conditions) {
        selectQuery = selectQuery.where(condition);
      }
    }
    
    // Apply pagination
    if (options?.limit) {
      selectQuery = selectQuery.limit(options.limit);
    }
    
    if (options?.offset) {
      selectQuery = selectQuery.offset(options.offset);
    }
    
    // Sort by publish date descending (newest first)
    selectQuery = selectQuery.orderBy(blogPosts.publish_date);
    
    return await selectQuery;
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
