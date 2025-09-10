// SPA-Aware Comprehensive Site Audit
// Enhanced version that understands Single Page Applications

import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000';
const OUT_DIR = 'audit-output';

// Key routes with expected functionality
const CRITICAL_ROUTES = [
  { path: '/', name: 'Homepage', type: 'landing', expectedElements: ['navigation', 'hero', 'cta'] },
  { path: '/about', name: 'About Page', type: 'content', expectedElements: ['content', 'navigation'] },
  { path: '/services', name: 'Services', type: 'content', expectedElements: ['service-list', 'navigation'] },
  { path: '/contact', name: 'Contact', type: 'form', expectedElements: ['contact-form', 'email', 'phone'] },
  { path: '/ai-tool-quiz', name: 'AI Tool Quiz', type: 'interactive', expectedElements: ['quiz', 'questions', 'submit'] },
  { path: '/ai-stack-builder', name: 'AI Stack Builder', type: 'tool', expectedElements: ['form', 'recommendations'] },
  { path: '/lead-magnet-builder', name: 'Lead Magnet Builder', type: 'tool', expectedElements: ['builder', 'templates'] },
  { path: '/competitor-intel-scanner', name: 'Competitor Scanner', type: 'tool', expectedElements: ['url-input', 'analyze'] },
  { path: '/ai-portal', name: 'AI Portal', type: 'app', expectedElements: ['dashboard', 'chat', 'tools'] },
  { path: '/blog', name: 'Blog', type: 'content', expectedElements: ['posts', 'navigation'] },
  { path: '/login', name: 'Login', type: 'auth', expectedElements: ['login-form', 'username', 'password'] }
];

const API_ENDPOINTS = [
  { path: '/api/health', method: 'GET', name: 'Health Check' },
  { path: '/api/blog/posts', method: 'GET', name: 'Blog Posts API' },
  { path: '/api/auth/status', method: 'GET', name: 'Auth Status' },
  { path: '/api/tools/ai-stack', method: 'GET', name: 'AI Stack Tool' },
  { path: '/api/analytics', method: 'GET', name: 'Analytics' }
];

let results = [];
let apiResults = [];
let spaFindings = [];
let recommendations = [];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Test API endpoints directly
async function testApiEndpoints() {
  console.log('🔌 Testing API endpoints...');
  
  for (const endpoint of API_ENDPOINTS) {
    try {
      const response = await fetch(BASE_URL + endpoint.path, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Site-Audit/1.0'
        }
      });
      
      apiResults.push({
        endpoint: endpoint.path,
        name: endpoint.name,
        method: endpoint.method,
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
        result: response.ok ? 'OK' : 'ERROR'
      });
      
      console.log(`   ${response.ok ? '✅' : '❌'} ${endpoint.path}: ${response.status}`);
      
    } catch (error) {
      apiResults.push({
        endpoint: endpoint.path,
        name: endpoint.name,
        method: endpoint.method,
        status: 0,
        ok: false,
        error: error.message,
        result: 'NETWORK_ERROR'
      });
      console.log(`   ❌ ${endpoint.path}: ${error.message}`);
    }
  }
}

// Analyze SPA structure and behavior
async function analyzeSpaStructure(route, html) {
  const findings = [];
  
  // Check if it's a SPA (React/Vue/Angular indicators)
  const isSPA = html.includes('react') || html.includes('vue') || html.includes('angular') || 
                html.includes('id="root"') || html.includes('id="app"') || 
                html.includes('/_nuxt/') || html.includes('/static/js/');
  
  if (isSPA) {
    findings.push('SPA Framework detected - requires JavaScript execution for full functionality');
  }
  
  // Check for key SPA indicators
  const indicators = [
    { pattern: /id="root"/i, meaning: 'React root element detected' },
    { pattern: /<script[^>]*src="[^"]*\.js"[^>]*>/gi, meaning: 'JavaScript bundles found' },
    { pattern: /window\.__INITIAL_STATE__/i, meaning: 'Server-side rendering state found' },
    { pattern: /@vite\/client/i, meaning: 'Vite development server detected' },
    { pattern: /react/i, meaning: 'React framework references found' },
    { pattern: /router/i, meaning: 'Client-side routing detected' }
  ];
  
  indicators.forEach(({ pattern, meaning }) => {
    if (pattern.test(html)) {
      findings.push(meaning);
    }
  });
  
  // Look for data-testid attributes (indicates testable elements exist)
  const testIds = [...html.matchAll(/data-testid\s*=\s*["']([^"']+)["']/gi)];
  if (testIds.length > 0) {
    findings.push(`${testIds.length} elements with data-testid found (good for testing)`);
  }
  
  // Check for accessibility attributes
  const a11yPatterns = [
    /aria-label/gi,
    /aria-describedby/gi,
    /role\s*=\s*["'](button|link|navigation|main|form)["']/gi
  ];
  
  const a11yCount = a11yPatterns.reduce((count, pattern) => {
    return count + (html.match(pattern) || []).length;
  }, 0);
  
  if (a11yCount > 0) {
    findings.push(`${a11yCount} accessibility attributes found`);
  }
  
  return findings;
}

// Test critical routes with SPA awareness
async function testCriticalRoutes() {
  console.log('🎯 Testing critical routes with SPA analysis...');
  
  for (const route of CRITICAL_ROUTES) {
    const fullUrl = BASE_URL + route.path;
    console.log(`Testing ${route.name}: ${route.path}`);
    
    try {
      const response = await fetch(fullUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Site-Audit/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      
      const html = response.ok ? await response.text() : '';
      const spaAnalysis = await analyzeSpaStructure(route, html);
      
      // Basic structure analysis
      const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(html);
      const hasMetaDesc = /<meta[^>]*name\s*=\s*["']description["'][^>]*>/i.test(html);
      const hasH1 = /<h1[^>]*>/i.test(html);
      
      results.push({
        route: route.path,
        name: route.name,
        type: route.type,
        status: response.status,
        ok: response.ok,
        hasTitle: hasTitle,
        hasMetaDescription: hasMetaDesc,
        hasH1: hasH1,
        spaFindings: spaAnalysis,
        htmlSize: html.length,
        result: response.ok ? 'ACCESSIBLE' : 'ERROR'
      });
      
      console.log(`   ${response.ok ? '✅' : '❌'} Status: ${response.status}, SPA: ${spaAnalysis.length > 0 ? 'Yes' : 'No'}`);
      
    } catch (error) {
      results.push({
        route: route.path,
        name: route.name,
        type: route.type,
        status: 0,
        ok: false,
        error: error.message,
        result: 'NETWORK_ERROR'
      });
      console.log(`   ❌ ${route.path}: ${error.message}`);
    }
    
    // Brief pause between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Generate intelligent recommendations based on findings
function generateRecommendations() {
  recommendations = [];
  
  // API endpoint recommendations
  const failedApis = apiResults.filter(api => !api.ok);
  if (failedApis.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      category: 'API Functionality',
      issue: `${failedApis.length} API endpoints are failing`,
      impact: 'Core application functionality may be broken',
      fix: 'Check API endpoint implementations and ensure proper error handling',
      details: failedApis.map(api => `${api.endpoint}: ${api.status || api.error}`)
    });
  }
  
  // SPA testing recommendations
  const spaRoutes = results.filter(r => r.spaFindings && r.spaFindings.length > 0);
  if (spaRoutes.length > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'Testing Strategy',
      issue: 'SPA detected - static HTML testing has limitations',
      impact: 'Interactive elements and dynamic content not fully tested',
      fix: 'Implement end-to-end testing with tools like Cypress, Playwright, or Selenium',
      details: ['Consider adding data-testid attributes for reliable element selection',
               'Test user workflows, not just individual page loads',
               'Set up automated testing pipeline for continuous validation']
    });
  }
  
  // SEO recommendations
  const missingTitles = results.filter(r => r.ok && !r.hasTitle);
  if (missingTitles.length > 0) {
    recommendations.push({
      priority: 'MEDIUM', 
      category: 'SEO',
      issue: `${missingTitles.length} pages missing proper titles`,
      impact: 'Poor search engine ranking and user experience',
      fix: 'Add unique, descriptive <title> tags to all pages',
      details: missingTitles.map(r => r.route)
    });
  }
  
  // Accessibility recommendations
  const needsA11y = results.filter(r => r.ok && (!r.hasH1 || r.spaFindings.some(f => f.includes('accessibility'))));
  if (needsA11y.length > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'Accessibility', 
      issue: 'Accessibility improvements needed',
      impact: 'Poor experience for users with disabilities',
      fix: 'Add proper heading structure, ARIA labels, and keyboard navigation',
      details: ['Ensure each page has exactly one H1 tag',
               'Add alt text to all images',
               'Test with screen readers']
    });
  }
  
  // Performance recommendations
  const largePages = results.filter(r => r.htmlSize && r.htmlSize > 100000);
  if (largePages.length > 0) {
    recommendations.push({
      priority: 'LOW',
      category: 'Performance',
      issue: `${largePages.length} pages with large HTML size`,
      impact: 'Slower page load times',
      fix: 'Optimize bundle size and implement code splitting',
      details: largePages.map(r => `${r.route}: ${Math.round(r.htmlSize/1000)}KB`)
    });
  }
}

// Generate comprehensive reports
async function generateReports() {
  console.log('📝 Generating SPA-aware audit reports...');
  
  // Route testing results
  const routeResultsPath = path.join(OUT_DIR, 'critical-routes-audit.json');
  fs.writeFileSync(routeResultsPath, JSON.stringify({
    summary: {
      totalRoutes: results.length,
      successfulRoutes: results.filter(r => r.ok).length,
      failedRoutes: results.filter(r => !r.ok).length,
      spaDetected: results.some(r => r.spaFindings && r.spaFindings.length > 0)
    },
    results: results
  }, null, 2));
  
  // API testing results  
  const apiResultsPath = path.join(OUT_DIR, 'api-endpoints-audit.json');
  fs.writeFileSync(apiResultsPath, JSON.stringify({
    summary: {
      totalEndpoints: apiResults.length,
      workingEndpoints: apiResults.filter(api => api.ok).length,
      failedEndpoints: apiResults.filter(api => !api.ok).length
    },
    results: apiResults
  }, null, 2));
  
  // Recommendations
  const recommendationsPath = path.join(OUT_DIR, 'intelligent-recommendations.json');
  fs.writeFileSync(recommendationsPath, JSON.stringify({
    summary: {
      totalRecommendations: recommendations.length,
      highPriority: recommendations.filter(r => r.priority === 'HIGH').length,
      mediumPriority: recommendations.filter(r => r.priority === 'MEDIUM').length,
      lowPriority: recommendations.filter(r => r.priority === 'LOW').length
    },
    recommendations: recommendations.sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
  }, null, 2));
  
  // Executive summary
  const workingRoutes = results.filter(r => r.ok).length;
  const workingApis = apiResults.filter(api => api.ok).length;
  
  const executiveSummary = `
🎯 SPA-AWARE COMPREHENSIVE AUDIT SUMMARY
========================================
Generated: ${new Date().toLocaleString()}
Audit Type: SPA-Aware with API Testing

📊 ROUTE ANALYSIS:
┌─────────────────────────────────────────────┐
│ Critical Routes: ${results.length.toString().padStart(2)} tested                   │
│ Successful: ${workingRoutes.toString().padStart(2)} pages accessible             │
│ Failed: ${(results.length - workingRoutes).toString().padStart(2)} pages with issues               │
│ Success Rate: ${((workingRoutes/results.length)*100).toFixed(1)}%                        │
└─────────────────────────────────────────────┘

🔌 API ENDPOINT ANALYSIS:
┌─────────────────────────────────────────────┐
│ API Endpoints: ${apiResults.length.toString().padStart(2)} tested                 │
│ Working: ${workingApis.toString().padStart(2)} endpoints functional           │
│ Failed: ${(apiResults.length - workingApis).toString().padStart(2)} endpoints with issues            │
│ API Health: ${((workingApis/apiResults.length)*100).toFixed(1)}%                        │
└─────────────────────────────────────────────┘

🎯 KEY FINDINGS:
${results.some(r => r.spaFindings && r.spaFindings.some(f => f.includes('React'))) ? '✅ SPA Framework: React detected' : '❓ SPA Framework: Not clearly detected'}
${results.some(r => r.spaFindings && r.spaFindings.some(f => f.includes('data-testid'))) ? '✅ Test Support: data-testid attributes found' : '❌ Test Support: No test IDs detected'}
${results.filter(r => r.hasTitle).length === results.length ? '✅ SEO: All pages have titles' : `❌ SEO: ${results.length - results.filter(r => r.hasTitle).length} pages missing titles`}
${apiResults.filter(api => api.ok).length > apiResults.length/2 ? '✅ API Health: Majority of endpoints working' : '❌ API Health: Multiple endpoint failures'}

🚨 PRIORITY RECOMMENDATIONS:
${recommendations.filter(r => r.priority === 'HIGH').map((r, i) => `${i+1}. ${r.issue}`).join('\n') || 'No high-priority issues found'}

🔧 TESTING STRATEGY RECOMMENDATIONS:
${results.some(r => r.spaFindings && r.spaFindings.length > 0) ? 
`- This is a Single Page Application (SPA)
- Static HTML testing has limitations  
- Recommend E2E testing with Playwright/Cypress
- Focus on user workflows and interactions
- Test dynamic content and state changes` :
`- Traditional multi-page application
- Static HTML testing provides good coverage
- Focus on link validation and form testing`}

📁 DETAILED REPORTS:
- critical-routes-audit.json (${results.length} routes analyzed)
- api-endpoints-audit.json (${apiResults.length} endpoints tested)
- intelligent-recommendations.json (${recommendations.length} actionable items)
- spa-aware-audit-summary.txt (this report)

🎖️ OVERALL HEALTH SCORE: ${(((workingRoutes/results.length) + (workingApis/apiResults.length))/2 * 100).toFixed(0)}/100

NEXT STEPS:
1. Address high-priority recommendations immediately
2. Set up proper E2E testing for SPA functionality  
3. Implement monitoring for API endpoints
4. Regular audits to catch regressions early
`;

  const summaryPath = path.join(OUT_DIR, 'spa-aware-audit-summary.txt');
  fs.writeFileSync(summaryPath, executiveSummary);
  
  console.log(executiveSummary);
  console.log(`\n📁 SPA-aware audit reports saved to: ${path.resolve(OUT_DIR)}/`);
}

// Main audit execution
async function runSpaAwareAudit() {
  ensureDir(OUT_DIR);
  
  console.log('🚀 Starting SPA-Aware Comprehensive Site Audit...');
  console.log('🔍 This audit understands Single Page Applications and tests accordingly\n');
  
  // Test server accessibility
  try {
    const serverTest = await fetch(BASE_URL);
    if (!serverTest.ok) {
      throw new Error(`Server returned ${serverTest.status}`);
    }
    console.log('✅ Server is accessible\n');
  } catch (error) {
    console.error(`❌ Server not accessible: ${error.message}`);
    process.exit(1);
  }
  
  // Run comprehensive tests
  await testApiEndpoints();
  console.log('');
  
  await testCriticalRoutes();
  console.log('');
  
  // Generate intelligent recommendations
  generateRecommendations();
  
  // Generate reports
  await generateReports();
  
  console.log('\n🎉 SPA-AWARE AUDIT COMPLETE!');
  console.log('=' + '='.repeat(40));
}

// Execute the audit
runSpaAwareAudit().catch(error => {
  console.error('❌ SPA-aware audit failed:', error);
  process.exit(1);
});