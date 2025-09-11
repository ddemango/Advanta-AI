// lib/blog/readingTime.ts
import rt from "reading-time";

export function getReadingTime(text: string) {
  try {
    return rt(text).text;          // e.g., "5 min read"
  } catch {
    const words = (text || "").trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
  }
}