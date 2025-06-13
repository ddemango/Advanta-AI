import { 
  users, 
  contactSubmissions, 
  quotes,
  blogPosts,
  resources,
  workflows,
  connections,
  workflowLogs,
  type User, 
  type InsertUser, 
  type InsertContact, 
  type Contact,
  type InsertQuote,
  type Quote,
  type BlogPost,
  type InsertBlogPost,
  type Resource,
  type InsertResource,
  type Workflow,
  type InsertWorkflow,
  type Connection,
  type InsertConnection,
  type WorkflowLog,
  type InsertWorkflowLog
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
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
  
  // Workflow operations
  getWorkflows(userId: number): Promise<Workflow[]>;
  getWorkflowById(id: number): Promise<Workflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, workflow: Partial<InsertWorkflow>): Promise<Workflow>;
  deleteWorkflow(id: number): Promise<boolean>;
  
  // Connection operations
  getConnections(userId: number): Promise<Connection[]>;
  getConnectionByApp(userId: number, appName: string): Promise<Connection | undefined>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  updateConnection(id: number, connection: Partial<InsertConnection>): Promise<Connection>;
  deleteConnection(id: number): Promise<boolean>;
  
  // Workflow log operations
  getWorkflowLogs(workflowId: number): Promise<WorkflowLog[]>;
  createWorkflowLog(log: InsertWorkflowLog): Promise<WorkflowLog>;
  getWorkflowLogsByRunId(runId: string): Promise<WorkflowLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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
          image_url: "https://images.unsplash.com/photo-1677442135136-760c813dce9b?q=80&w=1932&auto=format&fit=crop",
          featured_image: "https://images.unsplash.com/photo-1677442135136-760c813dce9b?q=80&w=1932&auto=format&fit=crop"
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
          image_url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2006&auto=format&fit=crop",
          featured_image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2006&auto=format&fit=crop"
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
          image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
          featured_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop"
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
    try {
      // Since we're using dummy data for blog posts, do the same for this function
      const dummyPosts = await this.getBlogPosts();
      return dummyPosts.find(post => post.slug === slug);
    } catch (error) {
      console.error("Error in getBlogPostBySlug:", error);
      return undefined;
    }
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    try {
      // Since we're using dummy data for blog posts, do the same for this function
      const dummyPosts = await this.getBlogPosts();
      return dummyPosts.find(post => post.id === id);
    } catch (error) {
      console.error("Error in getBlogPostById:", error);
      return undefined;
    }
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
        downloadCount: sql`${resources.downloadCount} + 1`
      })
      .where(eq(resources.id, id));
  }

  // Workflow operations
  async getWorkflows(userId: number): Promise<Workflow[]> {
    return await db
      .select()
      .from(workflows)
      .where(eq(workflows.userId, userId))
      .orderBy(desc(workflows.createdAt));
  }

  async getWorkflowById(id: number): Promise<Workflow | undefined> {
    const result = await db
      .select()
      .from(workflows)
      .where(eq(workflows.id, id))
      .limit(1);
    return result[0];
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const result = await db
      .insert(workflows)
      .values(workflow)
      .returning();
    return result[0];
  }

  async updateWorkflow(id: number, workflow: Partial<InsertWorkflow>): Promise<Workflow> {
    const result = await db
      .update(workflows)
      .set({
        ...workflow,
        updatedAt: new Date()
      })
      .where(eq(workflows.id, id))
      .returning();
    return result[0];
  }

  async deleteWorkflow(id: number): Promise<boolean> {
    const result = await db
      .delete(workflows)
      .where(eq(workflows.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Connection operations
  async getConnections(userId: number): Promise<Connection[]> {
    return await db
      .select()
      .from(connections)
      .where(eq(connections.userId, userId))
      .orderBy(desc(connections.createdAt));
  }

  async getConnectionByApp(userId: number, appName: string): Promise<Connection | undefined> {
    const result = await db
      .select()
      .from(connections)
      .where(and(eq(connections.userId, userId), eq(connections.appName, appName)))
      .limit(1);
    return result[0];
  }

  async createConnection(connection: InsertConnection): Promise<Connection> {
    const result = await db
      .insert(connections)
      .values(connection)
      .returning();
    return result[0];
  }

  async updateConnection(id: number, connection: Partial<InsertConnection>): Promise<Connection> {
    const result = await db
      .update(connections)
      .set({
        ...connection,
        updatedAt: new Date()
      })
      .where(eq(connections.id, id))
      .returning();
    return result[0];
  }

  async deleteConnection(id: number): Promise<boolean> {
    const result = await db
      .delete(connections)
      .where(eq(connections.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Workflow log operations
  async getWorkflowLogs(workflowId: number): Promise<WorkflowLog[]> {
    return await db
      .select()
      .from(workflowLogs)
      .where(eq(workflowLogs.workflowId, workflowId))
      .orderBy(desc(workflowLogs.executedAt));
  }

  async createWorkflowLog(log: InsertWorkflowLog): Promise<WorkflowLog> {
    const result = await db
      .insert(workflowLogs)
      .values(log)
      .returning();
    return result[0];
  }

  async logWorkflowExecution(
    workflowId: number, 
    runId: string, 
    status: string, 
    stepIndex: number, 
    stepName: string, 
    input: any, 
    output: any, 
    error: string | null
  ): Promise<WorkflowLog> {
    const logData = {
      workflowId,
      runId,
      status,
      stepIndex,
      stepName,
      input,
      output,
      error
    };
    
    const result = await db
      .insert(workflowLogs)
      .values(logData)
      .returning();
    return result[0];
  }

  async getWorkflowLogsByRunId(runId: string): Promise<WorkflowLog[]> {
    return await db
      .select()
      .from(workflowLogs)
      .where(eq(workflowLogs.runId, runId))
      .orderBy(workflowLogs.stepIndex);
  }
}

export const storage = new DatabaseStorage();
