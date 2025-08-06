#!/usr/bin/env node

import http from 'http';
import { URL } from 'url';

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

function testToolAvailability(tool) {
  return new Promise((resolve) => {
    const url = new URL(tool.route, BASE_URL);
    const startTime = Date.now();
    
    const req = http.get(url, (res) => {
      const loadTime = Date.now() - startTime;
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        const result = {
          name: tool.name,
          route: tool.route,
          category: tool.category,
          url: url.toString(),
          status: 'UNKNOWN',
          httpStatus: res.statusCode,
          loadTime,
          issues: [],
          hasContent: data.length > 0
        };

        // Analyze the response
        if (res.statusCode === 200) {
          // Check if content looks like a real page
          const hasTitle = data.includes('<title>') && !data.includes('404');
          const hasReactRoot = data.includes('id="root"') || data.includes('react');
          const isNotFound = data.toLowerCase().includes('not found') || 
                           data.toLowerCase().includes('404') ||
                           data.toLowerCase().includes('page not found');
          
          if (isNotFound) {
            result.status = 'FAILED';
            result.issues.push('Page returns 404 or "Not Found" content');
          } else if (hasTitle && hasReactRoot && data.length > 1000) {
            result.status = 'LOADS_PROPERLY';
          } else if (data.length > 500) {
            result.status = 'BASIC_LOAD';
            result.issues.push('Page loads but content may be incomplete');
          } else {
            result.status = 'MINIMAL_CONTENT';
            result.issues.push('Very little content returned');
          }
        } else if (res.statusCode === 404) {
          result.status = 'FAILED';
          result.issues.push('HTTP 404 - Route not found');
        } else if (res.statusCode >= 500) {
          result.status = 'FAILED';
          result.issues.push(`HTTP ${res.statusCode} - Server error`);
        } else {
          result.status = 'ISSUES_FOUND';
          result.issues.push(`HTTP ${res.statusCode} - Unexpected status code`);
        }

        resolve(result);
      });
    });

    req.on('error', (err) => {
      resolve({
        name: tool.name,
        route: tool.route,
        category: tool.category,
        url: url.toString(),
        status: 'FAILED',
        httpStatus: 0,
        loadTime: Date.now() - startTime,
        issues: [`Connection error: ${err.message}`],
        hasContent: false
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        name: tool.name,
        route: tool.route,
        category: tool.category,
        url: url.toString(),
        status: 'FAILED',
        httpStatus: 0,
        loadTime: Date.now() - startTime,
        issues: ['Request timeout after 10 seconds'],
        hasContent: false
      });
    });
  });
}

async function runSimpleQAAudit() {
  console.log('🚀 Starting Simple QA Audit of Free Tools');
  console.log(`📊 Testing ${TOOLS_TO_TEST.length} tools for basic availability\n`);

  const results = [];
  let workingCount = 0;
  let failedCount = 0;
  let issuesCount = 0;

  // Test each tool sequentially to avoid overwhelming the server
  for (let i = 0; i < TOOLS_TO_TEST.length; i++) {
    const tool = TOOLS_TO_TEST[i];
    console.log(`🔍 Testing ${i + 1}/${TOOLS_TO_TEST.length}: ${tool.name}`);
    
    const result = await testToolAvailability(tool);
    results.push(result);

    // Update counters and display status
    switch (result.status) {
      case 'LOADS_PROPERLY':
        workingCount++;
        console.log(`   ✅ LOADS PROPERLY (${result.loadTime}ms)`);
        break;
      case 'BASIC_LOAD':
        console.log(`   ⚠️  BASIC LOAD (${result.loadTime}ms) - ${result.issues[0] || 'No specific issues'}`);
        break;
      case 'MINIMAL_CONTENT':
        issuesCount++;
        console.log(`   🔧 MINIMAL CONTENT (${result.loadTime}ms) - ${result.issues[0] || 'No specific issues'}`);
        break;
      case 'ISSUES_FOUND':
        issuesCount++;
        console.log(`   🔧 ISSUES FOUND (${result.loadTime}ms) - ${result.issues[0] || 'No specific issues'}`);
        break;
      case 'FAILED':
        failedCount++;
        console.log(`   ❌ FAILED (${result.loadTime}ms) - ${result.issues[0] || 'No specific issues'}`);
        break;
    }

    // Brief pause between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Generate comprehensive report
  console.log('\n' + '='.repeat(80));
  console.log('📋 QA AUDIT REPORT - TOOL AVAILABILITY');
  console.log('='.repeat(80));
  
  console.log(`\n📊 SUMMARY STATISTICS:`);
  console.log(`   Total Tools Tested: ${TOOLS_TO_TEST.length}`);
  console.log(`   ✅ Loading Properly: ${workingCount}`);
  console.log(`   ⚠️  Basic Load: ${results.filter(r => r.status === 'BASIC_LOAD').length}`);
  console.log(`   🔧 Tools with Issues: ${issuesCount}`);
  console.log(`   ❌ Failed to Load: ${failedCount}`);
  console.log(`   📈 Availability Rate: ${((workingCount + results.filter(r => r.status === 'BASIC_LOAD').length) / TOOLS_TO_TEST.length * 100).toFixed(1)}%`);

  // Breakdown by category
  const categories = [...new Set(TOOLS_TO_TEST.map(t => t.category))];
  console.log(`\n📂 BREAKDOWN BY CATEGORY:`);
  categories.forEach(category => {
    const categoryResults = results.filter(r => r.category === category);
    const categoryWorking = categoryResults.filter(r => r.status === 'LOADS_PROPERLY' || r.status === 'BASIC_LOAD').length;
    const categoryTotal = categoryResults.length;
    console.log(`   ${category}: ${categoryWorking}/${categoryTotal} available`);
  });

  // Failed tools details
  const failedTools = results.filter(r => r.status === 'FAILED');
  if (failedTools.length > 0) {
    console.log(`\n❌ FAILED TOOLS (${failedTools.length}):`);
    failedTools.forEach(tool => {
      console.log(`   • ${tool.name}`);
      console.log(`     URL: ${tool.url}`);
      console.log(`     Status: HTTP ${tool.httpStatus}`);
      console.log(`     Issue: ${tool.issues.join(', ')}`);
    });
  }

  // Tools with issues
  const toolsWithIssues = results.filter(r => r.status === 'ISSUES_FOUND' || r.status === 'MINIMAL_CONTENT');
  if (toolsWithIssues.length > 0) {
    console.log(`\n🔧 TOOLS WITH ISSUES (${toolsWithIssues.length}):`);
    toolsWithIssues.forEach(tool => {
      console.log(`   • ${tool.name}`);
      console.log(`     URL: ${tool.url}`);
      console.log(`     Status: HTTP ${tool.httpStatus}`);
      console.log(`     Issue: ${tool.issues.join(', ')}`);
    });
  }

  // Performance insights
  const workingTools = results.filter(r => r.status === 'LOADS_PROPERLY' || r.status === 'BASIC_LOAD');
  if (workingTools.length > 0) {
    const avgLoadTime = workingTools.reduce((sum, r) => sum + r.loadTime, 0) / workingTools.length;
    const slowestTools = workingTools.sort((a, b) => b.loadTime - a.loadTime).slice(0, 5);
    console.log(`\n⚡ PERFORMANCE INSIGHTS:`);
    console.log(`   Average Load Time: ${avgLoadTime.toFixed(0)}ms`);
    console.log(`   Slowest Loading Tools:`);
    slowestTools.forEach((tool, index) => {
      console.log(`     ${index + 1}. ${tool.name}: ${tool.loadTime}ms`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('BASIC AVAILABILITY AUDIT COMPLETE');
  console.log('='.repeat(80));
  console.log('\n💡 NOTE: This audit only tests basic page availability.');
  console.log('   Full functional testing would require browser automation.');

  return {
    summary: {
      total: TOOLS_TO_TEST.length,
      working: workingCount,
      basicLoad: results.filter(r => r.status === 'BASIC_LOAD').length,
      issues: issuesCount,
      failed: failedCount,
      availabilityRate: ((workingCount + results.filter(r => r.status === 'BASIC_LOAD').length) / TOOLS_TO_TEST.length * 100).toFixed(1)
    },
    results,
    failedTools,
    toolsWithIssues,
    categories: categories.map(cat => ({
      name: cat,
      tools: results.filter(r => r.category === cat)
    }))
  };
}

// Run the audit
runSimpleQAAudit()
  .then(report => {
    console.log('\n✅ QA Audit completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ QA Audit failed:', error);
    process.exit(1);
  });