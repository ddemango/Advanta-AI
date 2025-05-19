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

// --- Types ---

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissions.$inferSelect;
