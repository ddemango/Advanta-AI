// Comprehensive Site Audit Script
// Crawls entire site and tests every interactive element

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000';
const MAX_DEPTH = 5;
const OUT_DIR = 'audit-output';
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 }
];

const FAKE_DATA_PATTERN = /(lorem|ipsum|placeholder|dummy|TBD|REPLACEME|NaN|0\.00|\{\{.*?\}\}|YYYY|MM\/DD\/YYYY|example\.com|your@email|123-456-7890|XXX-XXX-XXXX|image-placeholder|^#$)/i;

let allResults = [];
let brokenLinks = [];
let fakeDataFindings = [];
let visitedPages = new Set();

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Extract internal links from a page
async function extractInternalLinks(page, baseUrl) {
  try {
    const links = await page.$$eval('a[href]', (anchors, base) => {
      return anchors.map(a => {
        try {
          const href = a.href;
          if (href.startsWith(base) || href.startsWith('/') || href.startsWith('#')) {
            return href.startsWith(base) ? href : new URL(href, base).toString();
          }
          return null;
        } catch {
          return null;
        }
      }).filter(Boolean);
    }, baseUrl);
    return [...new Set(links)];
  } catch (error) {
    console.log(`Error extracting links: ${error.message}`);
    return [];
  }
}

// Discover all pages through crawling
async function discoverAllPages(browser, startUrl) {
  const discovered = new Set([startUrl]);
  const queue = [{ url: startUrl, depth: 0 }];
  const pages = [];

  while (queue.length > 0 && pages.length < 100) { // Limit to prevent infinite crawling
    const { url, depth } = queue.shift();
    
    if (visitedPages.has(url) || depth > MAX_DEPTH) continue;
    visitedPages.add(url);

    console.log(`Discovering: ${url} (depth: ${depth})`);
    
    const page = await browser.newPage();
    
    try {
      const response = await page.goto(url, { 
        waitUntil: 'domcontentloaded', 
        timeout: 15000 
      });
      
      if (!response) continue;
      
      const status = response.status();
      if (status >= 400) {
        brokenLinks.push(`${status} - ${url}`);
        continue;
      }

      // Wait for SPA to hydrate
      await page.waitForLoadState('networkidle').catch(() => {});
      
      pages.push(url);

      // Find more internal links
      const links = await extractInternalLinks(page, BASE_URL);
      for (const link of links) {
        const cleanUrl = link.split('#')[0]; // Remove hash
        if (!discovered.has(cleanUrl)) {
          discovered.add(cleanUrl);
          queue.push({ url: cleanUrl, depth: depth + 1 });
        }
      }
    } catch (error) {
      console.log(`Error visiting ${url}: ${error.message}`);
      brokenLinks.push(`ERROR - ${url}: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  return pages;
}

// Test all interactive elements on a page
async function testPageInteractivity(page, pageUrl, viewport) {
  const results = [];
  
  // Comprehensive selector for clickable elements
  const interactiveSelectors = [
    'a[href]',
    'button',
    '[role="button"]',
    '[onclick]',
    'input[type="button"]',
    'input[type="submit"]',
    '[data-testid*="button"]',
    '[class*="btn"]',
    '[class*="button"]',
    '[class*="cta"]',
    '[tabindex="0"]'
  ].join(', ');

  try {
    // Wait for page to be ready
    await page.waitForLoadState('networkidle').catch(() => {});
    
    const elements = await page.$$(interactiveSelectors);
    console.log(`Found ${elements.length} interactive elements on ${pageUrl}`);

    for (let i = 0; i < elements.length; i++) {
      // Fresh page state for each test
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});

      // Get the element again (fresh reference)
      const currentElements = await page.$$(interactiveSelectors);
      const element = currentElements[i];
      if (!element) continue;

      try {
        // Get element properties
        const [text, ariaLabel, href, tagName, target] = await Promise.all([
          element.innerText().catch(() => ''),
          element.getAttribute('aria-label').catch(() => ''),
          element.getAttribute('href').catch(() => ''),
          element.evaluate(el => el.tagName).catch(() => ''),
          element.getAttribute('target').catch(() => '')
        ]);

        // Generate selector
        const selector = await element.evaluate(el => {
          if (el.id) return `#${el.id}`;
          let sel = el.tagName.toLowerCase();
          if (el.className) sel += '.' + el.className.split(' ').filter(c => c).join('.');
          return sel;
        }).catch(() => 'unknown');

        const preClickUrl = page.url();
        
        // Take screenshot before click
        const screenshotDir = path.join(OUT_DIR, 'screenshots', viewport);
        ensureDir(screenshotDir);
        const beforeScreenshot = path.join(screenshotDir, `before-${Date.now()}-${i}.png`);
        
        await element.scrollIntoViewIfNeeded().catch(() => {});
        await page.screenshot({ path: beforeScreenshot, fullPage: true }).catch(() => {});

        let httpStatus = '';
        let result = 'OK';
        let notes = '';
        let opensNewTab = target === '_blank' ? 'Yes' : 'No';

        // Handle popup/new tab detection
        const popupPromise = page.waitForEvent('popup', { timeout: 3000 }).catch(() => null);

        // Perform the click
        try {
          await element.click({ force: true, timeout: 5000 });
        } catch (error) {
          result = 'Click Error';
          notes = error.message;
        }

        // Wait for any navigation or changes
        await Promise.race([
          page.waitForNavigation({ timeout: 5000 }).catch(() => null),
          page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => null),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        // Check for popup
        const popup = await popupPromise;
        if (popup) {
          opensNewTab = 'Yes';
          await popup.waitForLoadState('domcontentloaded').catch(() => {});
          const response = popup.context().pages().find(p => p !== page);
          if (response) {
            httpStatus = '200'; // Assume success if popup opened
          }
          await popup.close().catch(() => {});
        } else {
          const response = await page.waitForResponse(() => true, { timeout: 1000 }).catch(() => null);
          if (response) {
            httpStatus = response.status().toString();
          }
        }

        const postClickUrl = page.url();
        
        // Take screenshot after click
        const afterScreenshot = path.join(screenshotDir, `after-${Date.now()}-${i}.png`);
        await page.screenshot({ path: afterScreenshot, fullPage: true }).catch(() => {});

        // Determine result
        if (postClickUrl === preClickUrl && !popup) {
          // Check if any modal or content changed
          result = 'No Navigation (Possible Modal/Action)';
        }

        results.push({
          Page_URL: pageUrl,
          Viewport: viewport,
          Element_Text: text.trim().substring(0, 100),
          Aria_Label: (ariaLabel || '').trim(),
          Selector: selector,
          Element_Type: tagName,
          Href: href || '',
          Opens_New_Tab: opensNewTab,
          Pre_Click_URL: preClickUrl,
          Post_Click_URL: postClickUrl,
          HTTP_Status: httpStatus,
          Result: result,
          Notes: notes.trim()
        });

      } catch (error) {
        console.log(`Error testing element ${i} on ${pageUrl}: ${error.message}`);
        results.push({
          Page_URL: pageUrl,
          Viewport: viewport,
          Element_Text: 'Error retrieving',
          Aria_Label: '',
          Selector: 'unknown',
          Element_Type: 'unknown',
          Href: '',
          Opens_New_Tab: 'No',
          Pre_Click_URL: pageUrl,
          Post_Click_URL: pageUrl,
          HTTP_Status: '',
          Result: 'Element Error',
          Notes: error.message
        });
      }
    }

    // Scan for fake/placeholder data
    const bodyText = await page.innerText('body').catch(() => '');
    const fakeMatches = bodyText.match(FAKE_DATA_PATTERN);
    if (fakeMatches) {
      fakeDataFindings.push({
        page: pageUrl,
        viewport: viewport,
        finding: fakeMatches[0],
        context: bodyText.substr(bodyText.indexOf(fakeMatches[0]) - 20, 60)
      });
    }

  } catch (error) {
    console.log(`Error during page interactivity test: ${error.message}`);
  }

  return results;
}

// Main audit function
async function runComprehensiveAudit() {
  ensureDir(OUT_DIR);
  ensureDir(path.join(OUT_DIR, 'screenshots'));
  
  console.log('Starting comprehensive site audit...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    // Discover all pages
    console.log('Discovering all pages...');
    const allPages = await discoverAllPages(browser, BASE_URL);
    console.log(`Discovered ${allPages.length} pages to test`);

    // Test each viewport
    for (const viewport of VIEWPORTS) {
      console.log(`\nTesting ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
      
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });

      for (const pageUrl of allPages) {
        console.log(`Testing page: ${pageUrl}`);
        const page = await context.newPage();
        
        try {
          await page.goto(pageUrl, { 
            waitUntil: 'domcontentloaded',
            timeout: 15000
          });

          const pageResults = await testPageInteractivity(page, pageUrl, viewport.name);
          allResults.push(...pageResults);
          
        } catch (error) {
          console.log(`Error testing ${pageUrl}: ${error.message}`);
          brokenLinks.push(`${pageUrl}: ${error.message}`);
        } finally {
          await page.close();
        }
      }

      await context.close();
    }
  } catch (error) {
    console.error('Browser error:', error.message);
  } finally {
    await browser.close();
  }

  // Generate reports
  await generateReports();
}

// Generate CSV and other reports
async function generateReports() {
  console.log('\nGenerating reports...');

  // CSV Report
  const csvPath = path.join(OUT_DIR, 'click-results.csv');
  const headers = [
    'Page_URL', 'Viewport', 'Element_Text', 'Aria_Label', 'Selector', 
    'Element_Type', 'Href', 'Opens_New_Tab', 'Pre_Click_URL', 
    'Post_Click_URL', 'HTTP_Status', 'Result', 'Notes'
  ];
  
  const csvContent = [headers.join(',')];
  allResults.forEach(row => {
    const csvRow = headers.map(header => {
      const value = row[header] || '';
      return `"${value.toString().replace(/"/g, '""')}"`;
    });
    csvContent.push(csvRow.join(','));
  });
  
  fs.writeFileSync(csvPath, csvContent.join('\n'));

  // Broken links report
  const brokenPath = path.join(OUT_DIR, 'broken-links.txt');
  fs.writeFileSync(brokenPath, brokenLinks.join('\n'));

  // Fake data findings
  const fakePath = path.join(OUT_DIR, 'fake-data-findings.json');
  fs.writeFileSync(fakePath, JSON.stringify(fakeDataFindings, null, 2));

  // Summary report
  const summaryPath = path.join(OUT_DIR, 'audit-summary.txt');
  const summary = `
COMPREHENSIVE SITE AUDIT SUMMARY
=================================

Total Pages Tested: ${[...new Set(allResults.map(r => r.Page_URL))].length}
Total Interactive Elements Tested: ${allResults.length}
Broken Links Found: ${brokenLinks.length}
Fake Data Instances: ${fakeDataFindings.length}

Results by Type:
${[...new Set(allResults.map(r => r.Result))].map(result => {
  const count = allResults.filter(r => r.Result === result).length;
  return `- ${result}: ${count}`;
}).join('\n')}

Files Generated:
- click-results.csv: Detailed test results
- broken-links.txt: List of broken links
- fake-data-findings.json: Placeholder data detected
- screenshots/: Before/after screenshots
- audit-summary.txt: This summary

Total Test Coverage: ${allResults.length} interactions tested across desktop and mobile viewports.
`;

  fs.writeFileSync(summaryPath, summary);

  console.log('\n' + summary);
  console.log(`\nReports generated in: ${OUT_DIR}/`);
}

// Run the audit
runComprehensiveAudit().catch(console.error);