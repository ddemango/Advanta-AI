import { test, expect } from '@playwright/test';

test.describe('Blog Detail Body Rendering', () => {
  test('blog detail renders body with substantial content', async ({ page }) => {
    // Navigate to a known blog post
    await page.goto('/blog/navigating-ai-ethics-in-business-practical-guidelines-for-20');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Verify page loads successfully (no 404)
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).toContainText(/AI|Ethics|Business/i);
    
    // Verify article content exists and has substantial text
    const articleContent = page.locator('article, .prose, [data-testid="article-content"]');
    await expect(articleContent).toBeVisible();
    
    // Get the text content and validate word count
    const bodyText = await articleContent.innerText();
    const wordCount = bodyText.trim().split(/\s+/).length;
    
    // Assert body has more than 200 words
    expect(wordCount).toBeGreaterThan(200);
    
    // Ensure the content is not just placeholder text
    expect(bodyText).not.toContain('Lorem ipsum');
    expect(bodyText).not.toContain('placeholder');
    expect(bodyText).not.toContain('coming soon');
    
    // Verify content structure - should have meaningful paragraphs
    const paragraphs = page.locator('article p, .prose p');
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(3);
    
    // Check for proper heading structure
    const headings = page.locator('article h2, .prose h2, article h3, .prose h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(1);
  });

  test('blog detail shows error fallback when content missing', async ({ page }) => {
    // Try to navigate to a non-existent blog post
    await page.goto('/blog/non-existent-post-12345');
    
    // Should show 404 or error message, not empty page
    const errorMessage = page.locator('text="Post Not Found", text="404", text="Content Rendering Issue"').first();
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('blog detail handles MDX rendering gracefully', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('/blog/navigating-ai-ethics-in-business-practical-guidelines-for-20');
    await page.waitForLoadState('networkidle');
    
    // Check for no console errors related to MDX
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait a bit for any rendering errors to appear
    await page.waitForTimeout(2000);
    
    // Filter out known acceptable errors and focus on rendering issues
    const renderingErrors = consoleErrors.filter(error => 
      error.includes('MDX') || 
      error.includes('markdown') || 
      error.includes('Cannot read') ||
      error.includes('render')
    );
    
    expect(renderingErrors.length).toBe(0);
    
    // Verify content is properly rendered (no raw markdown)
    const content = await page.locator('article, .prose').innerText();
    expect(content).not.toMatch(/^#{1,6}\s/m); // No unrendered headers
    expect(content).not.toMatch(/\*\*.*\*\*/); // No unrendered bold
    expect(content).not.toMatch(/\[.*\]\(.*\)/); // No unrendered links
  });

  test('blog detail works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/blog/navigating-ai-ethics-in-business-practical-guidelines-for-20');
    await page.waitForLoadState('networkidle');
    
    // Verify content is readable on mobile
    const articleContent = page.locator('article, .prose');
    await expect(articleContent).toBeVisible();
    
    const bodyText = await articleContent.innerText();
    const wordCount = bodyText.trim().split(/\s+/).length;
    expect(wordCount).toBeGreaterThan(200);
    
    // Verify responsive layout doesn't break content
    const contentBox = await articleContent.boundingBox();
    expect(contentBox?.width).toBeLessThanOrEqual(375);
  });

  test('blog post renders without double-escaping HTML', async ({ page }) => {
    await page.goto('/blog/ai-automation-transforming-modern-business-operations');
    await page.waitForLoadState('networkidle');

    // Should not show raw HTML tags as text
    const bodyText = await page.locator('article .prose').innerText();
    expect(bodyText).not.toContain('&lt;p&gt;');
    expect(bodyText).not.toContain('&lt;/p&gt;');
    expect(bodyText).not.toContain('&amp;lt;');
    
    // Should have proper content length
    expect(bodyText.split(/\s+/).length).toBeGreaterThan(150);
  });

  test('blog detail shows no code fence wrapper', async ({ page }) => {
    await page.goto('/blog/navigating-ai-ethics-in-business-practical-guidelines-for-20');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText(/AI Ethics/i);

    // There should be no leading fenced code block wrapping the entire article
    const hasCodeFence = await page.locator('article pre code').first().isVisible().catch(() => false);
    if (hasCodeFence) {
      const firstBlockText = await page.locator('article pre code').first().innerText().catch(() => '');
      expect(/^<p>/.test(firstBlockText)).toBeFalsy();
    }

    // Body has substance (>200 words)
    const bodyText = await page.locator('article').innerText();
    expect(bodyText.split(/\s+/).length).toBeGreaterThan(200);
  });
});