// Node.js Enhanced Site Audit - Finding Real Issues
// Implements comprehensive testing without browser dependencies

import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const BASE_URL = 'http://localhost:5000';
const OUT_DIR = 'audit-output';

// Comprehensive route list for testing
const ALL_ROUTES = [
  '/',
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
  '/marketing-copy-generator',
  '/lead-magnet-builder',
  '/competitor-intel-scanner',
  '/travel-hacker-ai-v2',
  '/ai-portal',
  '/client-portal',
  '/best-ai-agency',
  '/ai-marketing-agency',
  '/top-ai-agencies-2025',
  '/ai-automation-services'
];

// API endpoints to test functionality
const API_ENDPOINTS = [
  { path: '/api/health', method: 'GET', name: 'Health Check', critical: true },
  { path: '/api/blog/posts', method: 'GET', name: 'Blog Posts', critical: true },
  { path: '/api/blog', method: 'GET', name: 'Blog API', critical: true },
  { path: '/api/auth/status', method: 'GET', name: 'Auth Status', critical: true },
  { path: '/api/tools/ai-stack', method: 'GET', name: 'AI Stack Tool', critical: false },
  { path: '/api/analytics', method: 'GET', name: 'Analytics', critical: false },
  { path: '/api/contact', method: 'POST', name: 'Contact Form', critical: true, 
    body: { name: 'Test User', email: 'test@example.com', message: 'Test message' }},
  { path: '/api/newsletter', method: 'POST', name: 'Newsletter Signup', critical: true,
    body: { email: 'test@example.com' }},
  { path: '/api/auth/login', method: 'POST', name: 'Login API', critical: true,
    body: { email: 'test@example.com', password: 'testpass' }}
];

let results = [];
let apiResults = [];
let brokenLinks = [];
let functionalIssues = [];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Test individual page functionality
async function testPageFunctionality(route) {
  const fullUrl = BASE_URL + route;
  const testResults = [];
  
  console.log(`\n🔍 Testing ${route} functionality...`);
  
  try {
    // Test page load
    const startTime = Date.now();
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Enhanced-Site-Audit/2.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000
    });
    const loadTime = Date.now() - startTime;
    
    if (!response.ok) {
      testResults.push({
        route,
        test: 'Page Load',
        result: 'FAIL',
        issue: `HTTP ${response.status}: ${response.statusText}`,
        critical: true,
        loadTime
      });
      console.log(`  ❌ Page load failed: ${response.status}`);
      return testResults;
    }
    
    const html = await response.text();
    const dom = new JSDOM(html, { url: fullUrl });
    const document = dom.window.document;
    
    // Test 1: Page Structure & SEO
    const title = document.querySelector('title');
    if (!title || !title.textContent.trim()) {
      testResults.push({
        route,
        test: 'SEO - Title',
        result: 'FAIL', 
        issue: 'Missing or empty title tag',
        critical: false,
        loadTime
      });
      console.log(`  ❌ Missing page title`);
    } else {
      testResults.push({
        route,
        test: 'SEO - Title', 
        result: 'OK',
        issue: `Title: "${title.textContent.trim()}"`,
        critical: false,
        loadTime
      });
      console.log(`  ✅ Title: "${title.textContent.substring(0, 50)}..."`);
    }
    
    // Test 2: Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc || !metaDesc.getAttribute('content')) {
      testResults.push({
        route,
        test: 'SEO - Meta Description',
        result: 'FAIL',
        issue: 'Missing meta description',
        critical: false,
        loadTime
      });
    } else {
      testResults.push({
        route,
        test: 'SEO - Meta Description',
        result: 'OK', 
        issue: 'Meta description present',
        critical: false,
        loadTime
      });
    }
    
    // Test 3: Heading Structure
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      testResults.push({
        route,
        test: 'Content Structure - H1',
        result: 'FAIL',
        issue: 'No H1 heading found - bad for SEO and accessibility',
        critical: false,
        loadTime
      });
      console.log(`  ❌ No H1 heading found`);
    } else if (h1s.length > 1) {
      testResults.push({
        route,
        test: 'Content Structure - H1',
        result: 'FAIL',
        issue: `Multiple H1 headings found (${h1s.length}) - should have exactly one`,
        critical: false,
        loadTime
      });
      console.log(`  ❌ Multiple H1 headings (${h1s.length})`);
    } else {
      testResults.push({
        route,
        test: 'Content Structure - H1',
        result: 'OK',
        issue: `H1: "${h1s[0].textContent.trim()}"`,
        critical: false,
        loadTime
      });
      console.log(`  ✅ H1: "${h1s[0].textContent.substring(0, 50)}..."`);
    }
    
    // Test 4: Interactive Elements Detection
    const buttons = document.querySelectorAll('button:not([disabled])');
    const links = document.querySelectorAll('a[href]');
    const forms = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input, textarea, select');
    
    const interactiveCount = buttons.length + links.length + forms.length;
    
    testResults.push({
      route,
      test: 'Interactive Elements',
      result: interactiveCount > 0 ? 'OK' : 'FAIL',
      issue: `Found ${buttons.length} buttons, ${links.length} links, ${forms.length} forms`,
      critical: interactiveCount === 0,
      loadTime,
      details: {
        buttons: buttons.length,
        links: links.length, 
        forms: forms.length,
        inputs: inputs.length
      }
    });
    
    console.log(`  ${interactiveCount > 0 ? '✅' : '❌'} Interactive elements: ${buttons.length} buttons, ${links.length} links, ${forms.length} forms`);
    
    // Test 5: Broken Internal Links
    for (const link of links) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        try {
          const linkResponse = await fetch(BASE_URL + href, { method: 'HEAD', timeout: 5000 });
          if (!linkResponse.ok) {
            testResults.push({
              route,
              test: 'Internal Link',
              result: 'FAIL',
              issue: `Broken internal link: ${href} (${linkResponse.status})`,
              critical: true,
              loadTime: 0,
              href
            });
            brokenLinks.push({ route, link: href, status: linkResponse.status });
            console.log(`  ❌ Broken link: ${href} (${linkResponse.status})`);
          }
        } catch (error) {
          testResults.push({
            route,
            test: 'Internal Link',
            result: 'FAIL',
            issue: `Link check failed: ${href} (${error.message})`,
            critical: true,
            loadTime: 0,
            href
          });
          brokenLinks.push({ route, link: href, error: error.message });
          console.log(`  ❌ Link check failed: ${href}`);
        }
      }
    }
    
    // Test 6: JavaScript Errors (check for common error patterns in HTML)
    if (html.includes('Error') || html.includes('undefined') || html.includes('null') || html.includes('NaN')) {
      const errorMatches = html.match(/(Error:|undefined|null|NaN)/gi) || [];
      if (errorMatches.length > 3) { // Allow some false positives
        testResults.push({
          route,
          test: 'JavaScript Errors',
          result: 'FAIL',
          issue: `Potential JS errors detected: ${errorMatches.length} instances`,
          critical: true,
          loadTime
        });
        console.log(`  ❌ Potential JS errors: ${errorMatches.length} instances`);
      }
    }
    
    // Test 7: Form Functionality Check
    for (const form of forms) {
      const action = form.getAttribute('action');
      const method = form.getAttribute('method') || 'GET';
      const formInputs = form.querySelectorAll('input, textarea, select');
      
      if (!action) {
        testResults.push({
          route,
          test: 'Form Configuration',
          result: 'FAIL',
          issue: 'Form missing action attribute - likely non-functional',
          critical: true,
          loadTime
        });
        console.log(`  ❌ Form missing action attribute`);
      } else if (formInputs.length === 0) {
        testResults.push({
          route,
          test: 'Form Configuration',
          result: 'FAIL', 
          issue: 'Form has no input fields',
          critical: true,
          loadTime
        });
        console.log(`  ❌ Form has no inputs`);
      } else {
        testResults.push({
          route,
          test: 'Form Configuration',
          result: 'OK',
          issue: `Form: ${method} ${action} (${formInputs.length} inputs)`,
          critical: false,
          loadTime
        });
        console.log(`  ✅ Form configured: ${method} ${action}`);
      }
    }
    
    // Test 8: Content Quality - Look for placeholder text
    const placeholderPatterns = [
      /lorem ipsum/gi,
      /placeholder/gi,
      /todo/gi,
      /coming soon/gi,
      /under construction/gi,
      /sample text/gi,
      /dummy content/gi,
      /test content/gi
    ];
    
    let placeholderCount = 0;
    placeholderPatterns.forEach(pattern => {
      const matches = html.match(pattern);
      if (matches) placeholderCount += matches.length;
    });
    
    if (placeholderCount > 0) {
      testResults.push({
        route,
        test: 'Content Quality',
        result: 'FAIL',
        issue: `${placeholderCount} placeholder/dummy content instances found`,
        critical: false,
        loadTime
      });
      console.log(`  ❌ Placeholder content: ${placeholderCount} instances`);
    }
    
    // Test 9: Performance Check
    if (loadTime > 3000) {
      testResults.push({
        route,
        test: 'Performance',
        result: 'FAIL',
        issue: `Slow load time: ${loadTime}ms (>3s)`,
        critical: false,
        loadTime
      });
      console.log(`  ❌ Slow load: ${loadTime}ms`);
    } else {
      testResults.push({
        route,
        test: 'Performance',
        result: 'OK',
        issue: `Load time: ${loadTime}ms`,
        critical: false,
        loadTime
      });
      console.log(`  ✅ Load time: ${loadTime}ms`);
    }
    
    console.log(`  📊 Tests completed: ${testResults.filter(r => r.result === 'OK').length}/${testResults.length} passed`);
    
  } catch (error) {
    testResults.push({
      route,
      test: 'Page Load',
      result: 'FAIL',
      issue: `Failed to load page: ${error.message}`,
      critical: true,
      loadTime: 0
    });
    console.log(`  ❌ Failed to test page: ${error.message}`);
  }
  
  return testResults;
}

// Test API endpoints comprehensively
async function testApiEndpoints() {
  console.log('\n🔌 Testing API endpoints comprehensively...');
  
  for (const endpoint of API_ENDPOINTS) {
    const fullUrl = BASE_URL + endpoint.path;
    console.log(`\n  Testing ${endpoint.name}: ${endpoint.method} ${endpoint.path}`);
    
    try {
      const startTime = Date.now();
      
      const fetchOptions = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Enhanced-Site-Audit/2.0',
          'Accept': 'application/json,text/html,*/*'
        },
        timeout: 10000
      };
      
      if (endpoint.body && (endpoint.method === 'POST' || endpoint.method === 'PUT')) {
        fetchOptions.body = JSON.stringify(endpoint.body);
      }
      
      const response = await fetch(fullUrl, fetchOptions);
      const responseTime = Date.now() - startTime;
      
      let responseData = '';
      try {
        responseData = await response.text();
      } catch (e) {
        responseData = 'Unable to read response';
      }
      
      const isJson = response.headers.get('content-type')?.includes('application/json');
      let parsedData = null;
      
      if (isJson) {
        try {
          parsedData = JSON.parse(responseData);
        } catch (e) {
          // Not valid JSON
        }
      }
      
      const result = {
        endpoint: endpoint.path,
        name: endpoint.name,
        method: endpoint.method,
        status: response.status,
        ok: response.ok,
        critical: endpoint.critical,
        responseTime,
        contentType: response.headers.get('content-type'),
        hasData: responseData.length > 0,
        isJson,
        dataPreview: responseData.substring(0, 200),
        result: response.ok ? 'OK' : 'FAIL'
      };
      
      // Enhanced validation for critical endpoints
      if (endpoint.critical && !response.ok) {
        result.issue = `Critical API failing: ${response.status} ${response.statusText}`;
        result.impact = 'Core functionality broken';
        
        functionalIssues.push({
          type: 'API_FAILURE',
          endpoint: endpoint.path,
          issue: result.issue,
          impact: result.impact,
          critical: true
        });
        
        console.log(`    ❌ CRITICAL: ${response.status} ${response.statusText}`);
      } else if (response.ok) {
        if (endpoint.path.includes('/blog') && (!parsedData || !parsedData.length)) {
          result.issue = 'Blog API returns no content';
          result.impact = 'Blog functionality may be broken';
          functionalIssues.push({
            type: 'EMPTY_RESPONSE', 
            endpoint: endpoint.path,
            issue: result.issue,
            impact: result.impact,
            critical: false
          });
          console.log(`    ⚠️  Returns no content`);
        } else {
          console.log(`    ✅ ${response.status} (${responseTime}ms) ${isJson ? 'JSON' : 'HTML'}`);
        }
      } else {
        console.log(`    ❌ ${response.status} ${response.statusText} (${responseTime}ms)`);
      }
      
      apiResults.push(result);
      
    } catch (error) {
      const result = {
        endpoint: endpoint.path,
        name: endpoint.name,
        method: endpoint.method,
        status: 0,
        ok: false,
        critical: endpoint.critical,
        error: error.message,
        result: 'FAIL',
        issue: `Network error: ${error.message}`,
        impact: endpoint.critical ? 'Core functionality broken' : 'Feature unavailable'
      };
      
      apiResults.push(result);
      
      if (endpoint.critical) {
        functionalIssues.push({
          type: 'NETWORK_ERROR',
          endpoint: endpoint.path,
          issue: result.issue,
          impact: result.impact,
          critical: true
        });
      }
      
      console.log(`    ❌ ${error.message}`);
    }
  }
}

// Generate comprehensive reports with actionable insights
async function generateEnhancedReports() {
  console.log('\n📝 Generating enhanced audit reports with actionable insights...');
  
  const allTests = results.flat();
  const failures = allTests.filter(t => t.result === 'FAIL');
  const criticalFailures = failures.filter(f => f.critical);
  const apiFailures = apiResults.filter(a => !a.ok);
  const criticalApiFailures = apiFailures.filter(a => a.critical);
  
  // Main results CSV
  const csvContent = [
    'Route,Test,Result,Issue,Critical,LoadTime_ms,Details',
    ...allTests.map(r => [
      r.route,
      r.test,
      r.result,
      `"${r.issue.replace(/"/g, '""')}"`,
      r.critical,
      r.loadTime || 0,
      r.details ? JSON.stringify(r.details) : ''
    ].join(','))
  ].join('\n');
  
  fs.writeFileSync(path.join(OUT_DIR, 'enhanced-functionality-audit.csv'), csvContent);
  
  // API results CSV
  const apiCsvContent = [
    'Endpoint,Name,Method,Status,OK,Critical,ResponseTime_ms,ContentType,HasData,Issue',
    ...apiResults.map(r => [
      r.endpoint,
      r.name,
      r.method,
      r.status,
      r.ok,
      r.critical,
      r.responseTime || 0,
      r.contentType || '',
      r.hasData || false,
      `"${(r.issue || '').replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');
  
  fs.writeFileSync(path.join(OUT_DIR, 'api-functionality-audit.csv'), apiCsvContent);
  
  // Critical Issues Report
  const criticalIssuesSummary = [
    ...criticalFailures.map(f => `PAGE: ${f.route} - ${f.issue}`),
    ...criticalApiFailures.map(f => `API: ${f.endpoint} - ${f.issue}`)
  ].join('\n');
  
  if (criticalIssuesSummary) {
    fs.writeFileSync(path.join(OUT_DIR, 'critical-issues-immediate-fix.txt'), 
      `CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION\n${'='.repeat(60)}\n\n${criticalIssuesSummary}\n\nThese issues are blocking core functionality and must be fixed immediately.`
    );
  }
  
  // Broken Links Report
  if (brokenLinks.length > 0) {
    const brokenLinksSummary = brokenLinks.map(bl => 
      `${bl.route}: ${bl.link} (${bl.status || bl.error})`
    ).join('\n');
    
    fs.writeFileSync(path.join(OUT_DIR, 'broken-links-report.txt'),
      `BROKEN LINKS REPORT\n${'='.repeat(30)}\n\n${brokenLinksSummary}`
    );
  }
  
  // Executive Summary
  const totalTests = allTests.length + apiResults.length;
  const totalFailures = failures.length + apiFailures.length;
  const successRate = ((totalTests - totalFailures) / totalTests * 100).toFixed(1);
  
  const executiveSummary = `
🎯 ENHANCED FUNCTIONALITY AUDIT - EXECUTIVE SUMMARY
==================================================
Generated: ${new Date().toLocaleString()}
Audit Type: Comprehensive Functionality Testing

📊 OVERALL RESULTS:
┌─────────────────────────────────────────────┐
│ Total Tests: ${totalTests.toString().padStart(3)} (Pages + APIs)             │
│ Successful: ${(totalTests - totalFailures).toString().padStart(3)} tests passed               │
│ Failed: ${totalFailures.toString().padStart(3)} tests failed                 │
│ Success Rate: ${successRate}%                       │
└─────────────────────────────────────────────┘

🚨 CRITICAL ISSUES:
┌─────────────────────────────────────────────┐
│ Critical Page Issues: ${criticalFailures.length.toString().padStart(2)} (Fix immediately)  │
│ Critical API Issues: ${criticalApiFailures.length.toString().padStart(2)} (Fix immediately)   │
│ Broken Links: ${brokenLinks.length.toString().padStart(2)} internal links broken      │
│ Functional Issues: ${functionalIssues.length.toString().padStart(2)} affecting UX          │
└─────────────────────────────────────────────┘

🔧 TOP CRITICAL ISSUES TO FIX:
${[...criticalFailures.slice(0, 3), ...criticalApiFailures.slice(0, 3)].map((issue, i) => 
  `${i+1}. ${issue.route || issue.endpoint}: ${issue.issue || issue.name}`
).join('\n') || 'No critical issues found!'}

📈 DETAILED FINDINGS:
- Page Load Issues: ${allTests.filter(t => t.test === 'Page Load' && t.result === 'FAIL').length}
- SEO Problems: ${allTests.filter(t => t.test.includes('SEO') && t.result === 'FAIL').length} 
- Content Issues: ${allTests.filter(t => t.test.includes('Content') && t.result === 'FAIL').length}
- Performance Issues: ${allTests.filter(t => t.test === 'Performance' && t.result === 'FAIL').length}
- API Failures: ${apiFailures.length}

📁 DETAILED REPORTS:
- enhanced-functionality-audit.csv (${allTests.length} page tests)
- api-functionality-audit.csv (${apiResults.length} API tests)
- critical-issues-immediate-fix.txt (${criticalFailures.length + criticalApiFailures.length} critical issues)
- broken-links-report.txt (${brokenLinks.length} broken links)

🎖️ FUNCTIONALITY HEALTH SCORE: ${successRate}/100

IMMEDIATE ACTION REQUIRED:
${criticalFailures.length + criticalApiFailures.length > 0 ? 
  `🚨 ${criticalFailures.length + criticalApiFailures.length} CRITICAL issues need immediate fixing!` :
  '✅ No critical issues found - site functionality is good!'}

This audit tested ACTUAL FUNCTIONALITY, not just page loads.
Every failure represents broken user experience that needs fixing.
`;

  fs.writeFileSync(path.join(OUT_DIR, 'enhanced-functionality-summary.txt'), executiveSummary);
  
  console.log(executiveSummary);
  console.log(`\n📁 Enhanced functionality audit reports saved to: ${path.resolve(OUT_DIR)}/`);
  
  if (criticalFailures.length + criticalApiFailures.length > 0) {
    console.log(`\n🚨 URGENT: ${criticalFailures.length + criticalApiFailures.length} critical issues found that need immediate fixing!`);
    console.log(`📄 See: critical-issues-immediate-fix.txt for details`);
  }
  
  return {
    totalTests,
    totalFailures,
    criticalIssues: criticalFailures.length + criticalApiFailures.length,
    successRate: parseFloat(successRate)
  };
}

// Main execution
async function runEnhancedFunctionalityAudit() {
  ensureDir(OUT_DIR);
  
  console.log('🚀 Starting Enhanced Functionality Audit...');
  console.log('🔍 This will test ACTUAL website functionality and find real issues\n');
  
  // Test server accessibility
  try {
    const serverTest = await fetch(BASE_URL, { timeout: 5000 });
    if (!serverTest.ok) {
      throw new Error(`Server returned ${serverTest.status}`);
    }
    console.log('✅ Server is accessible and responding\n');
  } catch (error) {
    console.error(`❌ Server not accessible: ${error.message}`);
    process.exit(1);
  }
  
  // Test API endpoints first (critical functionality)
  await testApiEndpoints();
  
  // Test page functionality  
  console.log('\n🌐 Testing page functionality across key routes...');
  console.log('=' + '='.repeat(60));
  
  for (let i = 0; i < Math.min(ALL_ROUTES.length, 20); i++) {
    const route = ALL_ROUTES[i];
    const pageResults = await testPageFunctionality(route);
    results.push(pageResults);
    
    // Brief pause between pages
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Generate comprehensive reports
  const summary = await generateEnhancedReports();
  
  console.log('\n🎉 ENHANCED FUNCTIONALITY AUDIT COMPLETE!');
  console.log('=' + '='.repeat(50));
  
  if (summary.criticalIssues > 0) {
    console.log(`\n⚠️  CRITICAL: Found ${summary.criticalIssues} issues that need immediate fixing!`);
    console.log('These are blocking core functionality and user experience.');
  } else {
    console.log('\n✅ Great news: No critical functionality issues found!');
  }
  
  return summary;
}

// Execute the audit
runEnhancedFunctionalityAudit().catch(error => {
  console.error('❌ Enhanced functionality audit failed:', error);
  process.exit(1);
});