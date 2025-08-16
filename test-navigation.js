// Test navigation functionality
const { chromium, firefox } = require('playwright');

async function runTestMatrix() {
  const browsers = [chromium, firefox];
  const viewports = [
    { width: 390, height: 844, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1440, height: 900, name: 'desktop' }
  ];
  
  let results = [];
  
  for (const browserType of browsers) {
    const browser = await browserType.launch();
    
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      
      try {
        // Test T1: Navigate to blog and click Read More
        await page.goto('http://localhost:5000/blog');
        await page.waitForSelector('[data-testid="blog-post-card"], .blog-post-card, button:has-text("Read More")', { timeout: 10000 });
        
        const readMoreButton = await page.locator('button:has-text("Read More")').first();
        await readMoreButton.click();
        
        // Test T2: Verify styled page loads
        await page.waitForURL(/\/blog\/[^\/]+/, { timeout: 5000 });
        const hasHeader = await page.locator('header, nav').count() > 0;
        const hasContent = await page.locator('article, main, .blog-content').count() > 0;
        
        results.push({
          browser: browserType.name(),
          viewport: viewport.name,
          test: 'T1-T2',
          status: hasHeader && hasContent ? 'PASS' : 'FAIL',
          url: page.url()
        });
        
        // Screenshot
        await page.screenshot({ 
          path: `evidence/screenshots/${browserType.name()}-${viewport.name}-blog-post.png`,
          fullPage: true 
        });
        
      } catch (error) {
        results.push({
          browser: browserType.name(),
          viewport: viewport.name,
          test: 'T1-T2',
          status: 'FAIL',
          error: error.message
        });
      }
      
      await context.close();
    }
    
    await browser.close();
  }
  
  return results;
}

module.exports = { runTestMatrix };