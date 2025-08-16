import axios from 'axios';
import { log } from './logger';

export interface QualityCheckResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  metadata?: any;
}

// Validate content structure and quality
export function validateContentStructure(markdown: string): QualityCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Check for H2 sections
    const hasH2 = /(^|\n)##\s+/.test(markdown);
    if (!hasH2) {
      errors.push('Missing H2 sections - content should be well-structured with headers');
    }

    // Check for implementation/how-to section
    const hasHowTo = /(^|\n)##\s+(how to|implementation|step-by-step|getting started)/i.test(markdown);
    if (!hasHowTo) {
      warnings.push('Consider adding a "How to implement" or practical section');
    }

    // Check content length
    const wordCount = markdown.split(/\s+/).length;
    if (wordCount < 300) {
      errors.push(`Content too short: ${wordCount} words (minimum 300)`);
    } else if (wordCount < 500) {
      warnings.push(`Content could be longer: ${wordCount} words (recommended 500+)`);
    }

    // Check for lists or bullet points
    const hasLists = /^\s*[-*+]\s+/m.test(markdown) || /^\s*\d+\.\s+/m.test(markdown);
    if (!hasLists) {
      warnings.push('Consider adding lists or bullet points for better readability');
    }

    // Check for code blocks or examples
    const hasCodeBlocks = /```[\s\S]*?```/.test(markdown) || /`[^`]+`/.test(markdown);
    if (!hasCodeBlocks && markdown.toLowerCase().includes('code')) {
      warnings.push('Consider adding code examples or snippets');
    }

    return {
      passed: errors.length === 0,
      errors,
      warnings,
      metadata: { wordCount, hasH2, hasHowTo, hasLists, hasCodeBlocks }
    };
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to validate content structure');
    return {
      passed: false,
      errors: ['Failed to validate content structure'],
      warnings: []
    };
  }
}

// Check for broken links in HTML content
export async function checkLinks(html: string): Promise<QualityCheckResult> {
  const warnings: string[] = [];
  
  try {
    const linkRegex = /<a [^>]*href="([^"]+)"/gi;
    const links = Array.from(html.matchAll(linkRegex)).map(m => m[1]);
    const uniqueLinks = [...new Set(links)].filter(url => /^https?:\/\//.test(url));
    
    if (uniqueLinks.length === 0) {
      return { passed: true, errors: [], warnings: [] };
    }

    // Check links with timeout and retries
    const results = await Promise.allSettled(
      uniqueLinks.map(async url => {
        try {
          const response = await axios.head(url, { 
            timeout: 5000,
            maxRedirects: 3,
            validateStatus: status => status < 400
          });
          return { url, status: response.status, ok: true };
        } catch (error: any) {
          return { url, status: error.response?.status || 0, ok: false, error: error.message };
        }
      })
    );

    const badLinks: string[] = [];
    results.forEach((result, index) => {
      if (result.status === 'rejected' || (result.value && !result.value.ok)) {
        badLinks.push(uniqueLinks[index]);
      }
    });

    if (badLinks.length > 0) {
      warnings.push(`Potentially unreachable links found: ${badLinks.slice(0, 3).join(', ')}${badLinks.length > 3 ? ` and ${badLinks.length - 3} more` : ''}`);
    }

    return {
      passed: true, // Non-blocking for now
      errors: [],
      warnings,
      metadata: { 
        totalLinks: uniqueLinks.length, 
        badLinks: badLinks.length,
        checkedUrls: uniqueLinks.slice(0, 10) // Log first 10 for debugging
      }
    };
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to check links');
    return {
      passed: true, // Non-blocking
      errors: [],
      warnings: ['Link checking failed - proceeding anyway']
    };
  }
}

// Check for AI tone and brand consistency
export function validateToneAndBrand(content: string): QualityCheckResult {
  const warnings: string[] = [];
  
  try {
    const lowerContent = content.toLowerCase();
    
    // Check for business/professional tone
    const hasBusinessKeywords = ['business', 'enterprise', 'solution', 'strategy', 'implementation', 'workflow'].some(word => 
      lowerContent.includes(word)
    );
    
    if (!hasBusinessKeywords) {
      warnings.push('Content could benefit from more business-focused language');
    }

    // Check for AI-related terms
    const hasAIKeywords = ['ai', 'artificial intelligence', 'automation', 'machine learning', 'intelligent'].some(word => 
      lowerContent.includes(word)
    );
    
    if (!hasAIKeywords) {
      warnings.push('Consider mentioning AI or automation benefits for brand consistency');
    }

    // Check for call-to-action or engagement
    const hasCTA = ['learn more', 'get started', 'contact', 'discover', 'explore', 'implement'].some(phrase => 
      lowerContent.includes(phrase)
    );
    
    if (!hasCTA) {
      warnings.push('Consider adding a call-to-action or engagement element');
    }

    return {
      passed: true, // Non-blocking
      errors: [],
      warnings,
      metadata: { hasBusinessKeywords, hasAIKeywords, hasCTA }
    };
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to validate tone and brand');
    return {
      passed: true,
      errors: [],
      warnings: ['Brand validation failed - proceeding anyway']
    };
  }
}

// Run all quality checks
export async function runQualityGates(markdown: string, html: string): Promise<QualityCheckResult> {
  try {
    const [structureResult, linkResult, brandResult] = await Promise.all([
      Promise.resolve(validateContentStructure(markdown)),
      checkLinks(html),
      Promise.resolve(validateToneAndBrand(markdown))
    ]);

    const allErrors = [
      ...structureResult.errors,
      ...linkResult.errors,
      ...brandResult.errors
    ];

    const allWarnings = [
      ...structureResult.warnings,
      ...linkResult.warnings,
      ...brandResult.warnings
    ];

    const passed = allErrors.length === 0;

    if (!passed) {
      log.warn({ errors: allErrors, warnings: allWarnings }, 'Quality gates failed');
    } else if (allWarnings.length > 0) {
      log.info({ warnings: allWarnings }, 'Quality gates passed with warnings');
    }

    return {
      passed,
      errors: allErrors,
      warnings: allWarnings,
      metadata: {
        structure: structureResult.metadata,
        links: linkResult.metadata,
        brand: brandResult.metadata
      }
    };
  } catch (error: any) {
    log.error({ error: error?.message || String(error) }, 'Failed to run quality gates');
    return {
      passed: false,
      errors: ['Quality gate system failed'],
      warnings: []
    };
  }
}