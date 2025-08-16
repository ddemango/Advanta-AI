import axios from 'axios';
import { log } from './logger';

export async function shareToX(title: string, slug: string): Promise<void> {
  if (!process.env.X_BEARER) {
    log.warn('X_BEARER not configured, skipping X share');
    return;
  }

  try {
    const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : 'https://advanta-ai.com';
    
    const text = `${title} — ${baseUrl}/blog/${slug}`;
    
    // Placeholder for X API integration
    // Replace with actual X API endpoint when configured
    log.info({ title, slug }, 'Would share to X (placeholder)');
    
    // Example implementation (uncomment when you have actual X API):
    // await axios.post('https://api.twitter.com/2/tweets', 
    //   { text }, 
    //   { headers: { Authorization: `Bearer ${process.env.X_BEARER}` } }
    // );
    
  } catch (error: any) {
    log.error({ error: error?.message || String(error), title, slug }, 'Failed to share to X');
  }
}

export async function shareToLinkedIn(title: string, slug: string): Promise<void> {
  if (!process.env.LINKEDIN_TOKEN) {
    log.warn('LINKEDIN_TOKEN not configured, skipping LinkedIn share');
    return;
  }

  try {
    const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : 'https://advanta-ai.com';
    
    const text = `${title}\n${baseUrl}/blog/${slug}`;
    
    // Placeholder for LinkedIn API integration
    // Replace with actual LinkedIn API endpoint when configured
    log.info({ title, slug }, 'Would share to LinkedIn (placeholder)');
    
    // Example implementation (uncomment when you have actual LinkedIn API):
    // await axios.post('https://api.linkedin.com/v2/ugcPosts', 
    //   { 
    //     author: process.env.LINKEDIN_PERSON_URN,
    //     lifecycleState: 'PUBLISHED',
    //     specificContent: {
    //       'com.linkedin.ugc.ShareContent': {
    //         shareCommentary: { text },
    //         shareMediaCategory: 'ARTICLE',
    //         media: [{
    //           status: 'READY',
    //           originalUrl: `${baseUrl}/blog/${slug}`
    //         }]
    //       }
    //     }
    //   }, 
    //   { headers: { Authorization: `Bearer ${process.env.LINKEDIN_TOKEN}` } }
    // );
    
  } catch (error: any) {
    log.error({ error: error?.message || String(error), title, slug }, 'Failed to share to LinkedIn');
  }
}

export async function shareToAllPlatforms(title: string, slug: string): Promise<void> {
  log.info({ title, slug }, 'Sharing post to social platforms');
  
  // Share in parallel for efficiency
  await Promise.allSettled([
    shareToX(title, slug),
    shareToLinkedIn(title, slug)
  ]);
}