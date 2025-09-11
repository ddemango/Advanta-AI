// lib/blog/normalize.ts
import { BlogSchema, type BlogPayload } from "./schema";

export function normalizeBlogPayload(raw: unknown): BlogPayload {
  // If your LLM returns Markdown, first convert to structured JSON
  // or run an extraction step. This is a strict JSON path:
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  const res = BlogSchema.safeParse(parsed);

  if (res.success) return res.data;

  // Attempt minimal repairs (example)
  const issues = res.error.flatten();
  // e.g., ensure sections array
  const candidate: any = { ...(parsed as any) };
  candidate.sections = Array.isArray(candidate.sections) ? candidate.sections : [];
  while (candidate.sections.length < 3) {
    candidate.sections.push({
      heading: "Additional Insights",
      content:
        "This section expands on the topic and provides further context to the reader.",
    });
  }

  const secondTry = BlogSchema.parse(candidate); // throws if still invalid
  return secondTry;
}