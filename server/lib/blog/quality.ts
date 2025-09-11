// lib/blog/quality.ts
export function ensureHeadings(markdown: string, minH2 = 3) {
  const h2s = (markdown.match(/^\s*##\s+/gm) || []).length;
  if (h2s < minH2) {
    throw new Error(`QUALITY_FAIL: Need at least ${minH2} H2 headings, found ${h2s}`);
  }
}