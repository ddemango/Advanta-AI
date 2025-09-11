import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  route: string;
  viewport: string;
  element: string;
  testId: string;
  result: string;
  notes: string;
  urlBefore: string;
  urlAfter: string;
  screenshot: string;
  domChanged: boolean;
  modalOpened: boolean;
  consoleErrors: number;
}

interface BrokenLink {
  route: string;
  viewport: string;
  link: string;
  status: number | string;
  error?: string;
}

interface FakeDataFinding {
  page: string;
  viewport: string;
  finding: string;
  context: string;
  position: number;
}

const routes = [
  '/',
  '/about',
  '/services',
  '/contact',
  '/blog',
  '/ai-tool-quiz',
  '/ai-stack-builder',
  '/lead-magnet-builder',
  '/competitor-intel-scanner',
  '/ai-portal',
  '/client-portal'
];

const results: TestResult[] = [];
const brokenLinks: BrokenLink[] = [];
const fakeDataFindings: FakeDataFinding[] = [];

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Enhanced click testing with strict failure detection (from user's provided logic)
async function testInteractiveElements(page: Page, route: string, viewport: string) {
  console.log(`🔍 Testing interactive elements on ${route} (${viewport})`);
  
  // Get all potentially clickable elements with enhanced selectors
  const selectors = [
    'button:not([disabled])',
    'a[href]',
    '[role="button"]',
    'input[type="submit"]',
    'input[type="button"]',
    '[onclick]',
    '.btn, .button',
    '[data-testid*="button"]',
    '[data-testid*="link"]',
    '[data-testid*="submit"]',
    'form button',
    'nav a',
    '.cta',
    '[aria-label*="click"]',
    '[aria-label*="submit"]'
  ];
  
  const elements = [];
  for (const selector of selectors) {
    try {
      const found = await page.$$(selector);
      for (const el of found) {
        const text = await el.textContent();
        const href = await el.getAttribute('href');
        const role = await el.getAttribute('role');
        const testId = await el.getAttribute('data-testid');
        const ariaLabel = await el.getAttribute('aria-label');
        
        elements.push({
          element: el,
          selector,
          text: text?.trim() || '',
          href,
          role,
          testId,
          ariaLabel
        });
      }
    } catch (e) {
      // Selector might not be valid, continue
    }
  }
  
  console.log(`Found ${elements.length} potentially interactive elements`);
  
  for (let i = 0; i < Math.min(elements.length, 20); i++) {
    const { element: el, selector, text, href, testId, ariaLabel } = elements[i];
    
    try {
      // Enhanced element visibility checks (from user's logic)
      const box = await el.boundingBox();
      if (!box || box.width < 2 || box.height < 2) {
        results.push({
          route,
          viewport,
          element: `${selector} "${text}"`,
          testId: testId || '',
          result: 'FAIL (Hidden/Zero-size)',
          notes: 'Element not interactable - hidden or zero size',
          urlBefore: '',
          urlAfter: '',
          screenshot: '',
          domChanged: false,
          modalOpened: false,
          consoleErrors: 0
        });
        continue;
      }
      
      const isVisible = await el.isVisible();
      if (!isVisible) {
        results.push({
          route,
          viewport,
          element: `${selector} "${text}"`,
          testId: testId || '',
          result: 'FAIL (Not Visible)',
          notes: 'Element exists but not visible to users',
          urlBefore: '',
          urlAfter: '',
          screenshot: '',
          domChanged: false,
          modalOpened: false,
          consoleErrors: 0
        });
        continue;
      }
      
      // Capture pre-click state
      const preURL = page.url();
      const preDomHTML = await page.content();
      
      // Set up console error tracking
      let hadConsoleIssue = false;
      const consoleMessages: string[] = [];
      const consoleListener = (msg: any) => {
        if (['error', 'warning'].includes(msg.type())) {
          hadConsoleIssue = true;
          consoleMessages.push(`${msg.type()}: ${msg.text()}`);
        }
      };
      page.on('console', consoleListener);
      
      // Set up network error tracking
      const reqErrors: string[] = [];
      const responseListener = async (response: any) => {
        try {
          const status = response.status();
          if (status >= 400) {
            reqErrors.push(`${status} ${response.url()}`);
          }
        } catch {}
      };
      page.on('response', responseListener);
      
      // Track if new tab/popup opens
      let popup = null;
      const popupPromise = new Promise(resolve => {
        page.context().on('page', (newPage: any) => {
          popup = newPage;
          resolve(newPage);
        });
        setTimeout(resolve, 1000);
      });
      
      // Take before screenshot
      const beforeScreenshot = `${route.replace(/\\//g, '_') || 'home'}_${viewport}_${i}_before.png`;
      await page.screenshot({ 
        path: path.join('audit-output', 'screenshots', beforeScreenshot),
        fullPage: false 
      });
      
      // Perform the click with timeout
      await el.click({ timeout: 5000 });
      
      // Wait for potential changes
      await Promise.race([
        page.waitForLoadState('networkidle', { timeout: 3000 }),
        page.waitForTimeout(2000)
      ]);
      
      await popupPromise;
      
      // Capture post-click state
      const postURL = page.url();
      const postHTML = await page.content();
      const domChanged = preDomHTML !== postHTML;
      
      // Check for modals/drawers
      const modalOpen = await page.$('[role="dialog"], [aria-modal="true"], .modal, .drawer, [aria-expanded="true"]');
      
      // Take after screenshot
      const afterScreenshot = `${route.replace(/\\//g, '_') || 'home'}_${viewport}_${i}_after.png`;
      await page.screenshot({ 
        path: path.join('audit-output', 'screenshots', afterScreenshot),
        fullPage: false 
      });
      
      // Clean up listeners
      page.off('console', consoleListener);
      page.off('response', responseListener);
      
      // STRICT RESULT CLASSIFICATION (user's provided logic)
      let result = '';
      let notes = '';
      
      // Classify strict outcomes  
      if (popup) {
        result = 'OK (New Tab)';
      } else if (postURL !== preURL) {
        result = /^https?:/.test(postURL) ? 'OK (Navigated)' : 'OK (Hash/Client Route)';
      } else if (modalOpen) {
        result = 'OK (Opened Modal/Drawer)';
      } else if (domChanged) {
        result = 'OK (In-Place Action)';
      } else {
        result = 'FAIL (No Nav, No Modal, No DOM Change)';
      }
      
      // HTTP & network failure amplification
      if (hadConsoleIssue) {
        notes += ` CONSOLE_ISSUE: ${consoleMessages.join('; ')}`;
        if (!result.startsWith('FAIL')) {
          result = 'FAIL (Console Error/Warning)';
        }
      }
      
      // API error amplification  
      if (reqErrors.length) {
        notes += ` API_FAILS: ${reqErrors.slice(0, 5).join(' | ')}`;
        if (!result.startsWith('FAIL')) {
          result = 'FAIL (API Error After Click)';
        }
      }
      
      // Additional context notes
      if (href) notes += ` href="${href}"`;
      if (testId) notes += ` testid="${testId}"`;
      if (ariaLabel) notes += ` aria-label="${ariaLabel}"`;
      
      results.push({
        route,
        viewport,
        element: `${selector} "${text.substring(0, 50)}"`,
        testId: testId || '',
        result,
        notes: notes.trim(),
        urlBefore: preURL,
        urlAfter: postURL,
        screenshot: `${beforeScreenshot} -> ${afterScreenshot}`,
        domChanged,
        modalOpened: !!modalOpen,
        consoleErrors: consoleMessages.length
      });
      
      // Log result
      const status = result.startsWith('FAIL') ? '❌' : '✅';
      console.log(`${status} "${text.substring(0, 30)}": ${result}`);
      
      // Track failures for priority reporting
      if (result.startsWith('FAIL')) {
        brokenLinks.push({
          route,
          viewport,
          link: text || href || selector,
          status: result,
          error: notes
        });
      }
      
      // Close popup if opened
      if (popup) {
        await (popup as any).close();
        popup = null;
      }
      
      // Brief pause between clicks
      await page.waitForTimeout(200);
      
    } catch (error: any) {
      results.push({
        route,
        viewport,
        element: `${selector} "${text}"`,
        testId: testId || '',
        result: 'FAIL (Click Error)',
        notes: `Error: ${error.message}`,
        urlBefore: '',
        urlAfter: '',
        screenshot: '',
        domChanged: false,
        modalOpened: false,
        consoleErrors: 0
      });
      
      console.log(`❌ "${text.substring(0, 30)}": Click failed - ${error.message}`);
    }
  }
}

// Detect fake/placeholder data
async function detectFakeData(page: Page, route: string, viewport: string) {
  const content = await page.content();
  const patterns = [
    /lorem ipsum/gi,
    /placeholder/gi,
    /todo/gi,
    /coming soon/gi,
    /under construction/gi,
    /sample text/gi,
    /dummy content/gi,
    /test content/gi,
    /example@/gi,
    /123-456-7890/gi
  ];
  
  patterns.forEach(pattern => {
    const matches = [...content.matchAll(pattern)];
    matches.forEach(match => {
      if (match.index !== undefined) {
        const context = content.substring(
          Math.max(0, match.index - 100),
          match.index + 100
        );
        
        fakeDataFindings.push({
          page: route,
          viewport,
          finding: match[0],
          context: context.replace(/\\s+/g, ' ').trim(),
          position: match.index
        });
      }
    });
  });
}

test.describe('Comprehensive Site Audit', () => {
  test.beforeAll(async () => {
    ensureDir('audit-output');
    ensureDir('audit-output/screenshots');
  });

  for (const route of routes) {
    test(`Audit ${route}`, async ({ page, browserName }) => {
      const viewport = browserName.includes('webkit') ? 'mobile' : 'desktop';
      
      try {
        // Navigate to page
        await page.goto(route, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Test interactive elements
        await testInteractiveElements(page, route, viewport);
        
        // Detect fake data
        await detectFakeData(page, route, viewport);
        
        // Basic page validation
        const title = await page.title();
        const h1 = await page.$('h1');
        
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(10);
        
      } catch (error: any) {
        console.log(`Failed to test ${route}: ${error.message}`);
        brokenLinks.push({
          route,
          viewport,
          link: 'PAGE_LOAD',
          status: 'NAVIGATION_ERROR',
          error: error.message
        });
      }
    });
  }

  test.afterAll(async () => {
    // Generate CSV report
    const csvContent = [
      'Route,Viewport,Element,TestId,Result,Notes,URL_Before,URL_After,Screenshot,DOM_Changed,Modal_Opened,Console_Errors',
      ...results.map(r => [
        r.route,
        r.viewport,
        `"${r.element.replace(/"/g, '""')}"`,
        r.testId,
        r.result,
        `"${r.notes.replace(/"/g, '""')}"`,
        r.urlBefore,
        r.urlAfter,
        r.screenshot,
        r.domChanged,
        r.modalOpened,
        r.consoleErrors
      ].join(','))
    ].join('\\n');
    
    fs.writeFileSync('audit-output/click-results.csv', csvContent);
    
    // Generate broken links report
    const brokenContent = brokenLinks.map(bl => 
      `${bl.route} (${bl.viewport}): ${bl.link} - ${bl.status} ${bl.error || ''}`
    ).join('\\n');
    
    fs.writeFileSync('audit-output/broken.txt', brokenContent || 'No broken links found');
    
    // Generate fake data report
    const fakeDataContent = JSON.stringify({
      summary: {
        totalFindings: fakeDataFindings.length,
        uniquePages: [...new Set(fakeDataFindings.map(f => f.page))].length,
        generatedAt: new Date().toISOString()
      },
      findings: fakeDataFindings
    }, null, 2);
    
    fs.writeFileSync('audit-output/fake-data.txt', fakeDataContent);
    
    // Generate executive summary
    const failures = results.filter(r => r.result.startsWith('FAIL'));
    const executiveSummary = `
# COMPREHENSIVE SITE AUDIT RESULTS
Generated: ${new Date().toLocaleString()}

## Summary
- **Total Tests**: ${results.length}
- **Successful**: ${results.length - failures.length}
- **Failed**: ${failures.length}
- **Success Rate**: ${((results.length - failures.length) / results.length * 100).toFixed(1)}%

## Critical Issues
${failures.slice(0, 10).map((f, i) => `${i+1}. ${f.route}: ${f.element} - ${f.result}`).join('\\n')}

## Broken Links
${brokenLinks.length} broken links found

## Fake Data
${fakeDataFindings.length} instances of placeholder/fake data detected

## Next Steps
1. Fix critical interactive element failures
2. Address broken links
3. Replace placeholder content
4. Set up continuous monitoring
`;
    
    fs.writeFileSync('audit-output/final-comprehensive-audit-report.md', executiveSummary);
    
    console.log(`\\n📁 Audit complete: ${results.length} tests run, ${failures.length} failures`);
  });
});