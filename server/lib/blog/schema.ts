// lib/blog/schema.ts
import { z } from "zod";

export const SectionSchema = z.object({
  heading: z.string().min(3),
  content: z.string().min(50),
});

export const BlogSchema = z.object({
  title: z.string().min(8),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(40),
  hero_image: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  sections: z.array(SectionSchema).min(3),  // require structure
  conclusion: z.string().min(50),
});

export type BlogPayload = z.infer<typeof BlogSchema>;