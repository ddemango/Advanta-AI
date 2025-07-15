import { 
  users, 
  contactSubmissions, 
  quotes,
  blogPosts,
  resources,
  workflows,
  connections,
  workflowLogs,
  passwordResetTokens,
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
  type InsertWorkflowLog,
  type PasswordResetToken,
  type InsertPasswordResetToken
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByProviderId(provider: string, providerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<User>;
  
  // Password reset operations
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markTokenAsUsed(tokenId: number): Promise<void>;
  
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

  async getUserByProviderId(provider: string, providerId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.provider, provider), eq(users.providerId, providerId)));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Password reset operations
  async createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db
      .insert(passwordResetTokens)
      .values(tokenData)
      .returning();
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false)
      ));
    return resetToken || undefined;
  }

  async markTokenAsUsed(tokenId: number): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, tokenId));
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
    return await db.select().from(quotes).where(eq(quotes.userId, userId));
  }

  // Blog operations
  async getBlogPosts(options?: { limit?: number, offset?: number, category?: string, tag?: string, published?: boolean }): Promise<BlogPost[]> {
    try {
      let query = db.select().from(blogPosts);
      
      // Apply filters
      if (options?.published !== undefined) {
        query = query.where(eq(blogPosts.published, options.published));
      }
      
      if (options?.category) {
        query = query.where(eq(blogPosts.category, options.category));
      }
      
      // Order by created date (newest first)
      query = query.orderBy(sql`${blogPosts.createdAt} DESC`);
      
      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.offset) {
        query = query.offset(options.offset);
      }
      
      const posts = await query.execute();
      return posts;
    } catch (error) {
      console.error("Error in getBlogPosts:", error);
      return [];
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
      return post || undefined;
    } catch (error) {
      console.error("Error in getBlogPostBySlug:", error);
      return undefined;
    }
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      return post || undefined;
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
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async incrementBlogPostViewCount(id: number): Promise<void> {
    await db
      .update(blogPosts)
      .set({
        viewCount: sql`${blogPosts.viewCount} + 1`
      })
      .where(eq(blogPosts.id, id));
  }

  // Resource operations
  async getResources(options?: { limit?: number, offset?: number, category?: string, type?: string, published?: boolean }): Promise<Resource[]> {
    let query = db.select().from(resources);
    
    if (options?.category) {
      query = query.where(eq(resources.category, options.category)) as any;
    }
    
    if (options?.type) {
      query = query.where(eq(resources.type, options.type)) as any;
    }
    
    if (options?.published !== undefined) {
      query = query.where(eq(resources.published, options.published)) as any;
    }
    
    if (options?.limit) {
      query = query.limit(options.limit) as any;
    }
    
    if (options?.offset) {
      query = query.offset(options.offset) as any;
    }
    
    const result = await query.orderBy(resources.createdAt);
    return result;
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
        updatedAt: new Date()
      })
      .where(eq(resources.id, id))
      .returning();
    return updatedResource;
  }

  async deleteResource(id: number): Promise<boolean> {
    const result = await db
      .delete(resources)
      .where(eq(resources.id, id));
    return (result.rowCount ?? 0) > 0;
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
