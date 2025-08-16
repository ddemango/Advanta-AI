const { test, expect } = require('@playwright/test');

test.describe('Blog Navigation Tests', () => {
  test('T1-T2: Blog post navigation and styling', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    // Wait for blog posts to load
    await page.waitForSelector('button:has-text("Read More")', { timeout: 10000 });
    
    // Click first "Read More" button
    const readMoreButton = page.locator('button:has-text("Read More")').first();
    await readMoreButton.click();
    
    // Wait for navigation to blog post page
    await page.waitForURL(/\/blog\/[^\/]+/);
    
    // Verify styled page elements
    await expect(page.locator('header, nav')).toBeVisible();
    await expect(page.locator('article, main, .blog-content')).toBeVisible();
    
    // Screenshot evidence
    await page.screenshot({ 
      path: 'evidence/screenshots/blog-post-styled.png',
      fullPage: true 
    });
  });

  test('T5-T6: Database and API verification', async ({ page }) => {
    // Test API endpoint directly
    const response = await page.request.get('/api/blog');
    expect(response.ok()).toBeTruthy();
    
    const blogPosts = await response.json();
    expect(Array.isArray(blogPosts)).toBeTruthy();
    expect(blogPosts.length).toBeGreaterThan(0);
    
    // Find GPT-4o post
    const gpt4oPost = blogPosts.find(post => 
      post.title.includes('GPT-4o') || post.title.includes('GPT-4o')
    );
    expect(gpt4oPost).toBeTruthy();
    expect(gpt4oPost.title).toContain('GPT-4o');
  });

  test('T8-T9: Route integrity', async ({ page }) => {
    // Test blog listing route
    await page.goto('/blog');
    await expect(page).toHaveURL('/blog');
    await page.waitForSelector('button:has-text("Read More")');
    
    // Test individual post route
    await page.goto('/blog/how-gpt-4o-is-revolutionizing-business-automation-in-2025');
    await page.waitForLoadState('networkidle');
    
    // Verify content loads
    await expect(page.locator('h1, h2, .blog-title')).toBeVisible();
    await expect(page.locator('article, .blog-content')).toBeVisible();
  });
});

test.describe('Viewport Tests', () => {
  ['mobile', 'tablet', 'desktop'].forEach(viewport => {
    test(`Blog navigation on ${viewport}`, async ({ page, browserName }) => {
      const viewports = {
        mobile: { width: 390, height: 844 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1440, height: 900 }
      };
      
      await page.setViewportSize(viewports[viewport]);
      await page.goto('/blog');
      await page.waitForSelector('button:has-text("Read More")');
      
      const readMoreButton = page.locator('button:has-text("Read More")').first();
      await readMoreButton.click();
      
      await page.waitForURL(/\/blog\/[^\/]+/);
      await page.screenshot({ 
        path: `evidence/screenshots/${browserName}-${viewport}-blog-post.png`,
        fullPage: true 
      });
    });
  });
});