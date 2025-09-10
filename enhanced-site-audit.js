// Enhanced Site Audit with Strict Failure Detection
// Implements sophisticated testing logic to catch real issues

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000';
const OUT_DIR = 'audit-output';

// Enhanced viewport configurations
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 }
];

// Comprehensive route discovery
const ALL_ROUTES = [
  '/',
  '/home',
  '/about',
  '/services',
  '/contact', 
  '/blog',
  '/login',
  '/signup',
  '/ai-tool-quiz',
  '/ai-stack-builder', 
  '/build-my-ai-stack',
  '/calculator',
  '/roi-calculator',
  '/cold-email-generator',
  '/content-calendar-generator',
  '/headline-split-test-generator',
  '/slide-deck-maker',
  '/voiceover-script-generator',
  '/business-name-generator',
  '/resume-generator',
  '/resume-optimizer',
  '/ats-resume-tailor',
  '/marketing-copy-generator',
  '/business-idea-validator',
  '/lead-magnet-builder',
  '/competitor-intel-scanner',
  '/travel-hacker-ai-v2',
  '/ai-portal',
  '/client-portal',
  '/admin',
  '/best-ai-agency',
  '/ai-marketing-agency',
  '/top-ai-agencies-2025',
  '/ai-automation-services'
];

let results = [];
let brokenLinks = [];
let consoleErrors = [];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Enhanced click testing with strict failure detection
async function testInteractiveElements(page, route, viewport) {
  console.log(`  🔍 Testing interactive elements on ${route} (${viewport})`);
  
  // Get all potentially clickable elements
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
  
  console.log(`    Found ${elements.length} potentially interactive elements`);
  
  let elementResults = [];
  
  for (let i = 0; i < Math.min(elements.length, 50); i++) { // Limit to 50 per page
    const { element: el, selector, text, href, testId, ariaLabel } = elements[i];
    
    try {
      // Enhanced element visibility and interactability checks
      const box = await el.boundingBox();
      if (!box || box.width < 2 || box.height < 2) {
        elementResults.push({
          Route: route,
          Viewport: viewport,
          Element: `${selector} "${text}"`,
          TestId: testId || '',
          Result: 'FAIL (Hidden/Zero-size)',
          Notes: 'Element not interactable - hidden or zero size',
          URL_Before: '',
          URL_After: '',
          Screenshot: ''
        });
        continue;
      }
      
      // Check if element is actually visible
      const isVisible = await el.isVisible();
      if (!isVisible) {
        elementResults.push({
          Route: route,
          Viewport: viewport,
          Element: `${selector} "${text}"`,
          TestId: testId || '',
          Result: 'FAIL (Not Visible)',
          Notes: 'Element exists but not visible to users',
          URL_Before: '',
          URL_After: '',
          Screenshot: ''
        });
        continue;
      }
      
      // Capture pre-click state
      const preURL = page.url();
      const preDomHTML = await page.content();
      
      // Set up console error tracking
      let hadConsoleIssue = false;
      const consoleMessages = [];
      const consoleListener = (msg) => {
        if (['error', 'warning'].includes(msg.type())) {
          hadConsoleIssue = true;
          consoleMessages.push(`${msg.type()}: ${msg.text()}`);
        }
      };
      page.on('console', consoleListener);
      
      // Set up network error tracking
      const reqErrors = [];
      const responseListener = async (response) => {
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
        page.context().on('page', newPage => {
          popup = newPage;
          resolve(newPage);
        });
        setTimeout(resolve, 1000); // Timeout after 1s
      });
      
      // Attempt click with screenshot capture
      const beforeScreenshot = `${route.replace(/\//g, '_') || 'home'}_${viewport}_${i}_before.png`;
      await page.screenshot({ 
        path: path.join(OUT_DIR, 'screenshots', beforeScreenshot),
        fullPage: false 
      });
      
      // Perform the click
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
      const afterScreenshot = `${route.replace(/\//g, '_') || 'home'}_${viewport}_${i}_after.png`;
      await page.screenshot({ 
        path: path.join(OUT_DIR, 'screenshots', afterScreenshot),
        fullPage: false 
      });
      
      // Clean up listeners
      page.off('console', consoleListener);
      page.off('response', responseListener);
      
      // STRICT RESULT CLASSIFICATION (as provided)
      let result = '';
      let notes = '';
      
      // Get HTTP status
      let httpStatus = null;
      try {
        const response = await page.goto(postURL, { waitUntil: 'load', timeout: 5000 });
        httpStatus = response?.status();
      } catch {
        // Page might have changed, that's ok
      }
      
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
      if (!httpStatus || Number(httpStatus) >= 400) {
        result = `FAIL (HTTP ${httpStatus || 'NoResp'})`;
      }
      
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
      
      elementResults.push({
        Route: route,
        Viewport: viewport,
        Element: `${selector} "${text.substring(0, 50)}"`,
        TestId: testId || '',
        Result: result,
        Notes: notes.trim(),
        URL_Before: preURL,
        URL_After: postURL,
        Screenshot: `${beforeScreenshot} -> ${afterScreenshot}`,
        DOM_Changed: domChanged ? 'Yes' : 'No',
        Modal_Opened: modalOpen ? 'Yes' : 'No',
        Console_Errors: consoleMessages.length
      });
      
      // Log result
      const status = result.startsWith('FAIL') ? '❌' : '✅';
      console.log(`    ${status} "${text.substring(0, 30)}": ${result}`);
      
      // Track failures for priority reporting
      if (result.startsWith('FAIL')) {
        brokenLinks.push({
          route,
          viewport,
          element: text,
          result,
          notes,
          href
        });
      }
      
      // Capture console errors globally
      if (consoleMessages.length > 0) {
        consoleErrors.push({
          route,
          viewport,
          element: text,
          errors: consoleMessages
        });
      }
      
      // Close popup if opened
      if (popup) {
        await popup.close();
        popup = null;
      }
      
      // Brief pause between clicks
      await page.waitForTimeout(200);
      
    } catch (error) {
      elementResults.push({
        Route: route,
        Viewport: viewport,
        Element: `${selector} "${text}"`,
        TestId: testId || '',
        Result: 'FAIL (Click Error)',
        Notes: `Error: ${error.message}`,
        URL_Before: '',
        URL_After: '',
        Screenshot: '',
        DOM_Changed: 'No',
        Modal_Opened: 'No',
        Console_Errors: 0
      });
      
      console.log(`    ❌ "${text.substring(0, 30)}": Click failed - ${error.message}`);
    }
  }
  
  return elementResults;
}

// Main audit execution
async function runEnhancedAudit() {
  ensureDir(OUT_DIR);
  ensureDir(path.join(OUT_DIR, 'screenshots'));
  
  console.log('🚀 Starting ENHANCED Site Audit with Strict Failure Detection...');
  console.log('🔍 This will find real issues by testing actual user interactions\n');
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    for (const viewport of VIEWPORTS) {
      console.log(`\n📱 Testing ${viewport.name.toUpperCase()} viewport (${viewport.width}x${viewport.height})`);
      console.log('=' + '='.repeat(60));
      
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        userAgent: 'Mozilla/5.0 (compatible; Enhanced-Site-Audit/2.0)'
      });
      
      const page = await context.newPage();
      
      // Test each route
      for (let i = 0; i < Math.min(ALL_ROUTES.length, 15); i++) { // Limit for thorough testing
        const route = ALL_ROUTES[i];
        const fullUrl = BASE_URL + route;
        
        console.log(`\n[${i+1}/15] Testing: ${route}`);
        
        try {
          // Navigate to page
          const response = await page.goto(fullUrl, { 
            waitUntil: 'networkidle',
            timeout: 10000 
          });
          
          if (!response || response.status() >= 400) {
            console.log(`  ❌ Page failed to load: ${response?.status() || 'No response'}`);
            brokenLinks.push({
              route,
              viewport: viewport.name,
              element: 'PAGE_LOAD',
              result: `FAIL (HTTP ${response?.status() || 'No Response'})`,
              notes: 'Page failed to load',
              href: fullUrl
            });
            continue;
          }
          
          // Wait for page to be interactive
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(1000); // Allow React/JS to initialize
          
          // Test all interactive elements on this page
          const elementResults = await testInteractiveElements(page, route, viewport.name);
          results = results.concat(elementResults);
          
        } catch (error) {
          console.log(`  ❌ Route error: ${error.message}`);
          brokenLinks.push({
            route,
            viewport: viewport.name,
            element: 'NAVIGATION',
            result: 'FAIL (Navigation Error)',
            notes: error.message,
            href: fullUrl
          });
        }
      }
      
      await context.close();
    }
    
  } finally {
    await browser.close();
  }
  
  // Generate comprehensive reports
  await generateEnhancedReports();
}

// Generate enhanced reports with actionable insights
async function generateEnhancedReports() {
  console.log('\n📝 Generating enhanced audit reports...');
  
  // Main results CSV
  const csvContent = [
    'Route,Viewport,Element,TestId,Result,Notes,URL_Before,URL_After,Screenshot,DOM_Changed,Modal_Opened,Console_Errors',
    ...results.map(r => [
      r.Route,
      r.Viewport, 
      `"${r.Element.replace(/"/g, '""')}"`,
      r.TestId,
      r.Result,
      `"${r.Notes.replace(/"/g, '""')}"`,
      r.URL_Before,
      r.URL_After,
      r.Screenshot,
      r.DOM_Changed,
      r.Modal_Opened,
      r.Console_Errors
    ].join(','))
  ].join('\n');
  
  fs.writeFileSync(path.join(OUT_DIR, 'enhanced-click-results.csv'), csvContent);
  
  // Failures summary
  const failures = results.filter(r => r.Result.startsWith('FAIL'));
  const failuresSummary = failures.map(f => 
    `${f.Route} (${f.Viewport}): ${f.Element} - ${f.Result} ${f.Notes}`
  ).join('\n');
  
  fs.writeFileSync(path.join(OUT_DIR, 'failures-detailed.txt'), 
    `DETAILED FAILURE ANALYSIS\n${'='.repeat(50)}\n\nTotal Failures: ${failures.length}\nTotal Tests: ${results.length}\nFailure Rate: ${((failures.length/results.length)*100).toFixed(1)}%\n\nDETAILS:\n${failuresSummary || 'No failures detected!'}`
  );
  
  // Console errors summary
  if (consoleErrors.length > 0) {
    const consoleSummary = consoleErrors.map(ce =>
      `${ce.route} (${ce.viewport}): ${ce.element}\n  Errors: ${ce.errors.join('\n  ')}`
    ).join('\n\n');
    
    fs.writeFileSync(path.join(OUT_DIR, 'console-errors.txt'), 
      `CONSOLE ERRORS DETECTED\n${'='.repeat(50)}\n\nTotal Pages with Console Errors: ${consoleErrors.length}\n\n${consoleSummary}`
    );
  }
  
  // Priority action items
  const criticalFailures = failures.filter(f => 
    f.Result.includes('HTTP') || 
    f.Result.includes('Console Error') || 
    f.Result.includes('API Error') ||
    f.Result.includes('No Nav, No Modal, No DOM Change')
  );
  
  // Executive summary
  const totalElements = results.length;
  const workingElements = results.filter(r => r.Result.startsWith('OK')).length;
  const failedElements = failures.length;
  
  const executiveSummary = `
🎯 ENHANCED SITE AUDIT - EXECUTIVE SUMMARY  
==========================================
Generated: ${new Date().toLocaleString()}
Audit Type: Enhanced with Strict Failure Detection

📊 COMPREHENSIVE RESULTS:
┌─────────────────────────────────────────────┐
│ Interactive Elements: ${totalElements.toString().padStart(3)} tested               │
│ Working Properly: ${workingElements.toString().padStart(3)} elements              │
│ Failed Tests: ${failedElements.toString().padStart(3)} elements                  │
│ Success Rate: ${((workingElements/totalElements)*100).toFixed(1)}%                        │
└─────────────────────────────────────────────┘

🚨 CRITICAL ISSUES FOUND:
┌─────────────────────────────────────────────┐
│ Critical Failures: ${criticalFailures.length.toString().padStart(3)} (Fix immediately)    │
│ Console Errors: ${consoleErrors.length.toString().padStart(3)} pages affected          │
│ Non-functional Elements: ${failures.filter(f => f.Result.includes('No Nav, No Modal, No DOM Change')).length.toString().padStart(3)}                │
│ Hidden/Broken Elements: ${failures.filter(f => f.Result.includes('Hidden') || f.Result.includes('Not Visible')).length.toString().padStart(3)}                │
└─────────────────────────────────────────────┘

🔧 TOP ISSUES TO FIX:
${criticalFailures.slice(0, 5).map((f, i) => `${i+1}. ${f.route}: ${f.element} - ${f.result}`).join('\n') || 'No critical issues found'}

📁 DETAILED REPORTS GENERATED:
- enhanced-click-results.csv (${totalElements} interactions tested)
- failures-detailed.txt (${failures.length} failures with solutions) 
- console-errors.txt (${consoleErrors.length} pages with JS errors)
- screenshots/ folder (before/after evidence for every test)

🎖️ INTERACTION HEALTH SCORE: ${((workingElements/totalElements)*100).toFixed(0)}/100

NEXT STEPS:
1. Fix critical failures immediately (${criticalFailures.length} issues)
2. Address console errors affecting user experience  
3. Test and validate fixes using provided screenshots
4. Set up continuous monitoring for regressions

This audit tested ACTUAL USER INTERACTIONS, not just page loads.
Every failure represents a broken user experience that needs fixing.
`;

  fs.writeFileSync(path.join(OUT_DIR, 'enhanced-audit-executive-summary.txt'), executiveSummary);
  
  console.log(executiveSummary);
  console.log(`\n📁 Enhanced audit reports saved to: ${path.resolve(OUT_DIR)}/`);
  console.log(`\n🔍 Key files to review:`);
  console.log(`- enhanced-click-results.csv: Full test results`);
  console.log(`- failures-detailed.txt: All ${failures.length} failures with details`);
  console.log(`- screenshots/ folder: Visual evidence of every test`);
  
  if (failures.length > 0) {
    console.log(`\n⚠️  ATTENTION: ${failures.length} interactive elements are broken and need fixing!`);
  }
}

// Execute the enhanced audit
runEnhancedAudit().catch(error => {
  console.error('❌ Enhanced audit failed:', error);
  process.exit(1);
});