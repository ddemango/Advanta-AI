#!/usr/bin/env node

const { chromium } = require('playwright');

// Complete list of tools from the free-tools page
const TOOLS_TO_TEST = [
  { name: 'Build My AI Stack', route: '/build-my-ai-stack', category: 'Business Strategy' },
  { name: 'AI Tool Quiz', route: '/ai-tool-quiz', category: 'Assessment' },
  { name: 'Trending Content Generator', route: '/trending-content-generator', category: 'Content Creation' },
  { name: 'Competitor Intel Scanner', route: '/competitor-intel-scanner', category: 'Market Research' },
  { name: 'Travel Hacker AI', route: '/travel-hacker-ai', category: 'Travel & Lifestyle' },
  { name: 'SocialClip Analyzer AI', route: '/socialclip-analyzer', category: 'Social Media' },
  { name: 'AI Tools Comparison Chart', route: '/ai-tools-comparison', category: 'Analysis' },
  { name: 'AI Competitor Intelligence Analyzer', route: '/competitor-intelligence', category: 'Market Research' },
  { name: 'Cold Email Generator', route: '/cold-email-generator', category: 'Sales & Marketing' },
  { name: 'Resume Generator', route: '/resume-generator', category: 'Career Tools' },
  { name: 'ATS Resume Tailor', route: '/ats-resume-tailor', category: 'Career Tools' },
  { name: 'LinkedIn Generator', route: '/linkedin-generator', category: 'Career Tools' },
  { name: 'AI Voiceover Script Generator', route: '/voiceover-script-generator', category: 'Content Creation' },
  { name: 'AI-Powered Slide Deck Maker', route: '/slide-deck-maker', category: 'Presentations' },
  { name: 'Automation Builder Wizard', route: '/automation-builder', category: 'Automation' },
  { name: 'Custom GPT Bot Generator', route: '/custom-gpt-generator', category: 'AI Development' },
  { name: 'Time-Saving Prompt Library', route: '/prompt-library', category: 'Resources' },
  { name: 'Landing Page Builder', route: '/landing-page-builder', category: 'Web Design' },
  { name: 'AI Workflow Explainer', route: '/workflow-explainer', category: 'Education' },
  { name: 'Content Calendar Generator', route: '/content-calendar-generator', category: 'Content Planning' },
  { name: 'Movie and TV Show Matchmaker', route: '/movie-matchmaker', category: 'Entertainment' },
  { name: 'Pricing Strategy Assistant', route: '/pricing-strategy-assistant', category: 'Business Strategy' },
  { name: 'Brand Kit Generator', route: '/brand-kit-generator', category: 'Branding' },
  { name: 'Lead Magnet Builder', route: '/lead-magnet-builder', category: 'Lead Generation' },
  { name: 'Marketing Copy Generator', route: '/business-name-generator', category: 'Copywriting' },
  { name: 'Headline Split-Test Generator', route: '/headline-split-test-generator', category: 'Testing & Optimization' },
  { name: 'Business Idea Validator', route: '/business-idea-validator', category: 'Business Strategy' },
  { name: 'CRM Use Case Finder', route: '/crm-use-case-finder', category: 'Business Tools' }
];

const BASE_URL = 'http://localhost:5000';

async function testTool(page, tool) {
  const result = {
    name: tool.name,
    route: tool.route,
    category: tool.category,
    url: `${BASE_URL}${tool.route}`,
    status: 'UNKNOWN',
    issues: [],
    loadTime: 0,
    keyElements: {
      hasTitle: false,
      hasInputs: false,
      hasButtons: false,
      hasOutput: false
    }
  };

  try {
    console.log(`\n🔍 Testing: ${tool.name} (${tool.route})`);
    
    const startTime = Date.now();
    const response = await page.goto(result.url, { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    result.loadTime = Date.now() - startTime;

    // Check if page loaded successfully
    if (!response || response.status() !== 200) {
      result.status = 'FAILED';
      result.issues.push(`HTTP ${response?.status() || 'No Response'}: Page failed to load`);
      return result;
    }

    // Wait for page to be fully loaded
    await page.waitForTimeout(2000);

    // Check for basic page elements
    const title = await page.title();
    result.keyElements.hasTitle = title && title.length > 0 && !title.includes('404');

    // Look for common input elements
    const inputs = await page.$$('input, textarea, select');
    result.keyElements.hasInputs = inputs.length > 0;

    // Look for buttons
    const buttons = await page.$$('button, input[type="submit"], .btn, [role="button"]');
    result.keyElements.hasButtons = buttons.length > 0;

    // Look for output areas (divs with results, pre tags, etc.)
    const outputElements = await page.$$('.result, .output, .generated, .response, pre, code, .card');
    result.keyElements.hasOutput = outputElements.length > 0;

    // Check for error messages
    const errorElements = await page.$$('.error, .alert-error, .text-red, .bg-red, [class*="error"]');
    if (errorElements.length > 0) {
      const errorText = await page.evaluate(() => {
        const errors = document.querySelectorAll('.error, .alert-error, .text-red, .bg-red, [class*="error"]');
        return Array.from(errors).map(el => el.textContent?.trim()).filter(text => text && text.length > 0);
      });
      if (errorText.length > 0) {
        result.issues.push(`Error messages found: ${errorText.join(', ')}`);
      }
    }

    // Check for specific loading indicators or broken states
    const loadingElements = await page.$$('.loading, .spinner, .skeleton');
    if (loadingElements.length > 0) {
      await page.waitForTimeout(5000); // Wait a bit more for loading to complete
      const stillLoading = await page.$$('.loading, .spinner, .skeleton');
      if (stillLoading.length > 0) {
        result.issues.push('Page appears to be stuck in loading state');
      }
    }

    // Check for 404 content
    const pageContent = await page.textContent('body');
    if (pageContent.toLowerCase().includes('not found') || 
        pageContent.toLowerCase().includes('404') ||
        pageContent.toLowerCase().includes('page not found')) {
      result.status = 'FAILED';
      result.issues.push('Page shows 404 or "Not Found" content');
      return result;
    }

    // Test basic functionality if it's an interactive tool
    if (result.keyElements.hasInputs && result.keyElements.hasButtons) {
      try {
        // Try to interact with the first input and button
        const firstInput = await page.$('input:not([type="hidden"]), textarea');
        const firstButton = await page.$('button:not([disabled]), input[type="submit"]');
        
        if (firstInput && firstButton) {
          await firstInput.fill('Test input');
          await firstButton.click();
          
          // Wait briefly to see if there's any response
          await page.waitForTimeout(3000);
          
          // Check if there was any change or response
          const responseElements = await page.$$('.result, .output, .generated, .response, .success, .updated');
          if (responseElements.length === 0) {
            result.issues.push('Tool did not respond to basic interaction test');
          }
        }
      } catch (interactionError) {
        result.issues.push(`Interaction test failed: ${interactionError.message}`);
      }
    }

    // Determine overall status
    if (result.issues.length === 0) {
      if (result.keyElements.hasTitle && (result.keyElements.hasInputs || result.keyElements.hasOutput)) {
        result.status = 'FUNCTIONAL';
      } else {
        result.status = 'BASIC_LOAD';
        result.issues.push('Page loads but may be missing key interactive elements');
      }
    } else {
      result.status = 'ISSUES_FOUND';
    }

  } catch (error) {
    result.status = 'FAILED';
    result.issues.push(`Critical error: ${error.message}`);
    console.error(`❌ Error testing ${tool.name}:`, error.message);
  }

  return result;
}

async function runQAAudit() {
  console.log('🚀 Starting Comprehensive QA Audit of Free Tools');
  console.log(`📊 Testing ${TOOLS_TO_TEST.length} tools total\n`);

  let browser;
  try {
    // Launch browser in headless mode
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    
    const page = await context.newPage();

    const results = [];
    let functionalCount = 0;
    let failedCount = 0;
    let issuesCount = 0;

    // Test each tool
    for (let i = 0; i < TOOLS_TO_TEST.length; i++) {
      const tool = TOOLS_TO_TEST[i];
      const result = await testTool(page, tool);
      results.push(result);

      // Update counters
      switch (result.status) {
        case 'FUNCTIONAL':
          functionalCount++;
          console.log(`✅ ${result.name}: FUNCTIONAL (${result.loadTime}ms)`);
          break;
        case 'BASIC_LOAD':
          console.log(`⚠️  ${result.name}: BASIC LOAD (${result.loadTime}ms)`);
          break;
        case 'ISSUES_FOUND':
          issuesCount++;
          console.log(`🔧 ${result.name}: ISSUES FOUND (${result.loadTime}ms)`);
          break;
        case 'FAILED':
          failedCount++;
          console.log(`❌ ${result.name}: FAILED (${result.loadTime}ms)`);
          break;
      }

      // Brief pause between tests
      await page.waitForTimeout(1000);
    }

    // Generate comprehensive report
    console.log('\n' + '='.repeat(80));
    console.log('📋 COMPREHENSIVE QA AUDIT REPORT');
    console.log('='.repeat(80));
    
    console.log(`\n📊 SUMMARY STATISTICS:`);
    console.log(`   Total Tools Tested: ${TOOLS_TO_TEST.length}`);
    console.log(`   ✅ Fully Functional: ${functionalCount}`);
    console.log(`   ⚠️  Basic Load Only: ${results.filter(r => r.status === 'BASIC_LOAD').length}`);
    console.log(`   🔧 Tools with Issues: ${issuesCount}`);
    console.log(`   ❌ Failed to Load: ${failedCount}`);
    console.log(`   📈 Success Rate: ${((functionalCount + results.filter(r => r.status === 'BASIC_LOAD').length) / TOOLS_TO_TEST.length * 100).toFixed(1)}%`);

    // Detailed breakdown by category
    const categories = [...new Set(TOOLS_TO_TEST.map(t => t.category))];
    console.log(`\n📂 BREAKDOWN BY CATEGORY:`);
    categories.forEach(category => {
      const categoryResults = results.filter(r => r.category === category);
      const categoryFunctional = categoryResults.filter(r => r.status === 'FUNCTIONAL').length;
      const categoryTotal = categoryResults.length;
      console.log(`   ${category}: ${categoryFunctional}/${categoryTotal} functional`);
    });

    // Failed tools details
    const failedTools = results.filter(r => r.status === 'FAILED');
    if (failedTools.length > 0) {
      console.log(`\n❌ FAILED TOOLS (${failedTools.length}):`);
      failedTools.forEach(tool => {
        console.log(`   • ${tool.name}`);
        console.log(`     URL: ${tool.url}`);
        console.log(`     Issues: ${tool.issues.join(', ')}`);
      });
    }

    // Tools with issues
    const toolsWithIssues = results.filter(r => r.status === 'ISSUES_FOUND');
    if (toolsWithIssues.length > 0) {
      console.log(`\n🔧 TOOLS WITH ISSUES (${toolsWithIssues.length}):`);
      toolsWithIssues.forEach(tool => {
        console.log(`   • ${tool.name}`);
        console.log(`     URL: ${tool.url}`);
        console.log(`     Issues: ${tool.issues.join(', ')}`);
      });
    }

    // Performance insights
    const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
    const slowestTools = results.sort((a, b) => b.loadTime - a.loadTime).slice(0, 5);
    console.log(`\n⚡ PERFORMANCE INSIGHTS:`);
    console.log(`   Average Load Time: ${avgLoadTime.toFixed(0)}ms`);
    console.log(`   Slowest Tools:`);
    slowestTools.forEach((tool, index) => {
      console.log(`     ${index + 1}. ${tool.name}: ${tool.loadTime}ms`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('QA AUDIT COMPLETE');
    console.log('='.repeat(80));

    return {
      summary: {
        total: TOOLS_TO_TEST.length,
        functional: functionalCount,
        basicLoad: results.filter(r => r.status === 'BASIC_LOAD').length,
        issues: issuesCount,
        failed: failedCount,
        successRate: ((functionalCount + results.filter(r => r.status === 'BASIC_LOAD').length) / TOOLS_TO_TEST.length * 100).toFixed(1)
      },
      results,
      categories: categories.map(cat => ({
        name: cat,
        tools: results.filter(r => r.category === cat)
      }))
    };

  } catch (error) {
    console.error('❌ Critical error during QA audit:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the audit
if (require.main === module) {
  runQAAudit()
    .then(report => {
      console.log('\n✅ QA Audit completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ QA Audit failed:', error);
      process.exit(1);
    });
}

module.exports = { runQAAudit, testTool, TOOLS_TO_TEST };