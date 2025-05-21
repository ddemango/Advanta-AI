import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// --- User related tables ---

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  name: text("name"),
  role: text("role").default("user"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

// --- AI Service related tables ---

export const serviceTypeEnum = pgEnum("service_type", [
  "chatbot", 
  "recommendation_system", 
  "content_generation", 
  "data_analytics", 
  "computer_vision", 
  "custom_solution"
]);

export const planEnum = pgEnum("plan", ["basic", "standard", "premium"]);
export const timelineEnum = pgEnum("timeline", ["standard", "expedited"]);

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  service_type: text("service_type").notNull(),
  plan: text("plan").notNull(),
  timeline: text("timeline").notNull(),
  project_scope: integer("project_scope").notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  estimated_price_min: integer("estimated_price_min").notNull(),
  estimated_price_max: integer("estimated_price_max").notNull(),
  status: text("status").default("pending"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertQuoteSchema = createInsertSchema(quotes).pick({
  user_id: true,
  service_type: true,
  plan: true,
  timeline: true,
  project_scope: true,
  features: true,
  estimated_price_min: true,
  estimated_price_max: true,
});

// --- Contact form submissions ---

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  industry: text("industry"),
  message: text("message").notNull(),
  consent: boolean("consent").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  company: true,
  industry: true,
  message: true,
  consent: true,
});

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
  quotes: many(quotes),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
  user: one(users, {
    fields: [quotes.user_id],
    references: [users.id],
  }),
}));

// --- Blog and Resources related tables ---

export const categoryEnum = pgEnum("category", [
  "ai_technology",
  "business_strategy",
  "case_studies",
  "tutorials",
  "industry_insights",
  "news",
  "resources"
]);

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  author_id: integer("author_id").references(() => users.id).notNull(),
  image_url: text("image_url"),
  featured_image: text("featured_image"),
  category: categoryEnum("category").notNull(),
  tags: text("tags").array().notNull(),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  reading_time: integer("reading_time"), // in minutes
  view_count: integer("view_count").default(0)
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  author_id: true,
  image_url: true,
  featured_image: true,
  category: true,
  tags: true,
  published: true,
  featured: true,
  reading_time: true,
  view_count: true
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  resource_type: text("resource_type").notNull(), // whitepaper, ebook, template, tool, etc.
  download_url: text("download_url"),
  featured_image: text("featured_image"),
  category: categoryEnum("category").notNull(),
  tags: jsonb("tags").notNull().$type<string[]>(),
  is_published: boolean("is_published").default(false),
  publish_date: timestamp("publish_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  download_count: integer("download_count").default(0)
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  slug: true,
  description: true,
  resource_type: true,
  download_url: true,
  featured_image: true,
  category: true,
  tags: true,
  is_published: true,
  publish_date: true
});

// --- Relations ---

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.author_id],
    references: [users.id]
  })
}));

// Extend user relations to include blog posts
export const extendedUserRelations = relations(users, ({ many }) => ({
  quotes: many(quotes),
  blogPosts: many(blogPosts)
}));

// --- Types ---

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
