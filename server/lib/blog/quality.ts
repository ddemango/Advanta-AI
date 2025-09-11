// lib/blog/quality.ts
export function ensureHeadings(markdown: string, minH2 = 3) {
  const h2s = (markdown.match(/^\s*##\s+/gm) || []).length;
  if (h2s < minH2) {
    throw new Error(`QUALITY_FAIL: Need at least ${minH2} H2 headings, found ${h2s}`);
  }
}

export function assertBodyHasContent(markdown: string, minWords = 250) {
  if (!markdown || typeof markdown !== 'string') {
    throw new Error(`QUALITY_FAIL: no markdown content provided`);
  }
  
  const cleanText = markdown
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Remove images
    .replace(/\[[^\]]*\]\([^)]+\)/g, '') // Remove links
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/[*_~`]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
    
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length < minWords) {
    throw new Error(`QUALITY_FAIL: body too short (${words.length} words, minimum ${minWords})`);
  }
  
  return true;
}