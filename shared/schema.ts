import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  serial,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  password: varchar("password"), // For traditional auth
  picture: varchar("picture"),
  provider: varchar("provider"), // 'google', 'apple', 'local' - nullable for traditional auth
  providerId: varchar("provider_id"), // nullable for traditional auth
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  serviceType: varchar("service_type").notNull(),
  plan: varchar("plan").notNull(),
  timeline: varchar("timeline").notNull(),
  estimatedCost: varchar("estimated_cost").notNull(),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Portal Usage Tracking
export const aiUsage = pgTable("ai_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  model: varchar("model").notNull(),
  inputTokens: integer("input_tokens").default(0),
  outputTokens: integer("output_tokens").default(0),
  totalTokens: integer("total_tokens").default(0),
  operationType: varchar("operation_type").notNull(), // 'chat', 'code', 'tts', 'humanize'
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Portal Projects
export const aiProjects = pgTable("ai_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  defaultModel: varchar("default_model").default("gpt-4o"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Portal Chats
export const aiChats = pgTable("ai_chats", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => aiProjects.id),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: varchar("title"),
  model: varchar("model").default("gpt-4o"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Portal Messages
export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => aiChats.id).notNull(),
  role: varchar("role").notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Portal Datasets
export const aiDatasets = pgTable("ai_datasets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => aiProjects.id).notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // 'csv', 'xlsx', 'json'
  preview: jsonb("preview"), // Sample rows and columns
  fullData: jsonb("full_data"), // Complete dataset
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Portal Artifacts (generated content)
export const aiArtifacts = pgTable("ai_artifacts", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => aiProjects.id).notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // 'chart', 'report', 'code', 'document'
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action").notNull(),
  targetType: varchar("target_type"),
  targetId: varchar("target_id"),
  metadata: jsonb("metadata"),
  ipAddress: varchar("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
});

// Insert schemas for AI Portal tables
export const insertAiUsageSchema = createInsertSchema(aiUsage).omit({
  id: true,
  createdAt: true,
});

export const insertAiProjectSchema = createInsertSchema(aiProjects).omit({
  id: true,
  createdAt: true,
});

export const insertAiChatSchema = createInsertSchema(aiChats).omit({
  id: true,
  createdAt: true,
});

export const insertAiMessageSchema = createInsertSchema(aiMessages).omit({
  id: true,
  createdAt: true,
});

export const insertAiDatasetSchema = createInsertSchema(aiDatasets).omit({
  id: true,
  createdAt: true,
});

export const insertAiArtifactSchema = createInsertSchema(aiArtifacts).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  company: varchar("company"),
  industry: varchar("industry"),
  message: text("message").notNull(),
  consent: boolean("consent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  summary: text("summary"),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: varchar("category").notNull(),
  tags: text("tags").array(),
  imageUrl: varchar("image_url"),
  featuredImage: varchar("featured_image"),
  readingTime: integer("reading_time").default(1),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  viewCount: integer("view_count").default(0),
  authorId: integer("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // 'pdf', 'guide', 'template', etc.
  category: varchar("category").notNull(),
  tags: text("tags").array(),
  fileSize: varchar("file_size"),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  imageUrl: text("image_url"),
  downloadUrl: text("download_url"),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  quotes: many(quotes),
  blogPosts: many(blogPosts),
  workflows: many(workflows),
  connections: many(connections),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
  user: one(users, {
    fields: [quotes.userId],
    references: [users.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissions.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// Workflows table
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  prompt: text("prompt").notNull(),
  workflowJson: jsonb("workflow_json").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Connections table for OAuth integrations
export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  appName: varchar("app_name", { length: 100 }).notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workflow execution logs
export const workflowLogs = pgTable("workflow_logs", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => workflows.id).notNull(),
  runId: varchar("run_id", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // 'running', 'success', 'error'
  stepIndex: integer("step_index").default(0),
  stepName: varchar("step_name", { length: 255 }),
  input: jsonb("input"),
  output: jsonb("output"),
  error: text("error"),
  executedAt: timestamp("executed_at").defaultNow(),
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkflowLogSchema = createInsertSchema(workflowLogs).omit({
  id: true,
  executedAt: true,
});

// Update relations
export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  user: one(users, {
    fields: [workflows.userId],
    references: [users.id],
  }),
  logs: many(workflowLogs),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
  user: one(users, {
    fields: [connections.userId],
    references: [users.id],
  }),
}));

export const workflowLogsRelations = relations(workflowLogs, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowLogs.workflowId],
    references: [workflows.id],
  }),
}));

export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;

export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Connection = typeof connections.$inferSelect;

export type InsertWorkflowLog = z.infer<typeof insertWorkflowLogSchema>;
export type WorkflowLog = typeof workflowLogs.$inferSelect;

// Waitlist tables
export const clientSuiteWaitlist = pgTable("client_suite_waitlist", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  source: varchar("source").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  notified: boolean("notified").default(false),
  priority: integer("priority").default(1),
});

export const marketplaceWaitlist = pgTable("marketplace_waitlist", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  source: varchar("source").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  notified: boolean("notified").default(false),
  priority: integer("priority").default(1),
});

// ATS Resume Analysis Tables
export const resumeAnalyses = pgTable("resume_analyses", {
  id: varchar("id").primaryKey().notNull(),
  userId: integer("user_id").references(() => users.id),
  originalResumeText: text("original_resume_text").notNull(),
  jobDescriptionText: text("job_description_text").notNull(),
  tailoredResumeText: text("tailored_resume_text").notNull(),
  changes: jsonb("changes").notNull(), // Array of change objects
  atsScore: integer("ats_score").notNull(),
  keywordMatches: jsonb("keyword_matches").notNull(),
  missingKeywords: jsonb("missing_keywords").notNull(),
  suggestions: jsonb("suggestions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResumeAnalysisSchema = createInsertSchema(resumeAnalyses).omit({
  createdAt: true,
});

export const resumeAnalysesRelations = relations(resumeAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [resumeAnalyses.userId],
    references: [users.id],
  }),
}));

export type InsertResumeAnalysis = z.infer<typeof insertResumeAnalysisSchema>;
export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;

// Newsletter subscribers table
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  unsubscribeToken: varchar("unsubscribe_token").unique(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  subscribedAt: true,
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Multi-tenant workflow builder schema as per checklist requirements

// Tenants table for multi-tenant architecture
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  themeId: integer("theme_id").references(() => themes.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_tenants_slug").on(table.slug),
]);

// Themes table for customizable branding
export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  json: jsonb("json").notNull(), // Theme configuration JSON
  createdAt: timestamp("created_at").defaultNow(),
});

// Pages table for tenant-specific content
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  json: jsonb("json").notNull(), // Page content JSON
  isPublished: boolean("is_published").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_pages_tenant_id").on(table.tenantId),
]);

// API Keys table for secure credential management
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  provider: varchar("provider", { length: 100 }).notNull(), // 'openai', 'slack', etc.
  authRef: varchar("auth_ref", { length: 255 }).notNull(), // Reference key
  encryptedSecret: text("encrypted_secret").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_api_keys_tenant_id").on(table.tenantId),
]);

// Update workflows table to include tenant relationship and proper status enum
export const workflowsUpdated = pgTable("workflows", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  userId: integer("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  prompt: text("prompt").notNull(),
  workflowJson: jsonb("workflow_json").notNull(),
  status: varchar("status", { length: 20 }).default("idle").notNull(), // 'idle','deploying','live','error'
  lastRunUrl: text("last_run_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_workflows_tenant_id").on(table.tenantId),
  index("idx_workflows_user_id").on(table.userId),
]);

// Insert schemas for new tables
export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
});

export const insertThemeSchema = createInsertSchema(themes).omit({
  id: true,
  createdAt: true,
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  updatedAt: true,
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  createdAt: true,
});

// Relations for new tables
export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  theme: one(themes, {
    fields: [tenants.themeId],
    references: [themes.id],
  }),
  pages: many(pages),
  workflows: many(workflowsUpdated),
  apiKeys: many(apiKeys),
}));

export const themesRelations = relations(themes, ({ many }) => ({
  tenants: many(tenants),
}));

export const pagesRelations = relations(pages, ({ one }) => ({
  tenant: one(tenants, {
    fields: [pages.tenantId],
    references: [tenants.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  tenant: one(tenants, {
    fields: [apiKeys.tenantId],
    references: [tenants.id],
  }),
}));

// Type exports for new tables
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;

export type InsertTheme = z.infer<typeof insertThemeSchema>;
export type Theme = typeof themes.$inferSelect;

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;