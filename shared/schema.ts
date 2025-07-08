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

export const insertQuoteSchema = createInsertSchema(quotes).omit({
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
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: varchar("category").notNull(),
  tags: text("tags").array(),
  published: boolean("published").default(false),
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
  fileUrl: varchar("file_url"),
  downloadCount: integer("download_count").default(0),
  published: boolean("published").default(false),
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