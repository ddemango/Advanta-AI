#!/usr/bin/env node

import http from 'http';
import { URL } from 'url';

// Specific tools that require more detailed functional testing
const PRIORITY_TOOLS = [
  { name: 'Build My AI Stack', route: '/build-my-ai-stack', expectedElements: ['form', 'button', 'select'] },
  { name: 'AI Tool Quiz', route: '/ai-tool-quiz', expectedElements: ['button', 'question', 'answer'] },
  { name: 'Trending Content Generator', route: '/trending-content-generator', expectedElements: ['input', 'button', 'generate'] },
  { name: 'Competitor Intel Scanner', route: '/competitor-intel-scanner', expectedElements: ['input', 'url', 'analyze'] },
  { name: 'Travel Hacker AI', route: '/travel-hacker-ai', expectedElements: ['input', 'destination', 'search'] },
  { name: 'Movie and TV Show Matchmaker', route: '/movie-matchmaker', expectedElements: ['select', 'mood', 'genre'] },
  { name: 'ATS Resume Tailor', route: '/ats-resume-tailor', expectedElements: ['upload', 'file', 'tailor'] }
];

const BASE_URL = 'http://localhost:5000';

function fetchPageContent(tool) {
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
          url: url.toString(),
          status: 'UNKNOWN',
          httpStatus: res.statusCode,
          loadTime,
          contentLength: data.length,
          functionalityChecks: {},
          issues: [],
          recommendations: []
        };

        if (res.statusCode === 200 && data.length > 0) {
          // Analyze content for functional elements
          const content = data.toLowerCase();
          
          // Check for basic page structure
          result.functionalityChecks.hasTitle = content.includes('<title>') && !content.includes('404');
          result.functionalityChecks.hasMetaTags = content.includes('<meta');
          result.functionalityChecks.hasReactApp = content.includes('id="root"') || content.includes('react');
          
          // Check for interactive elements
          result.functionalityChecks.hasInputs = content.includes('<input') || content.includes('input');
          result.functionalityChecks.hasButtons = content.includes('<button') || content.includes('button');
          result.functionalityChecks.hasForms = content.includes('<form') || content.includes('form');
          result.functionalityChecks.hasSelect = content.includes('<select') || content.includes('select');
          
          // Check for file upload capability
          result.functionalityChecks.hasFileUpload = content.includes('type="file"') || content.includes('upload');
          
          // Check for expected AI/API functionality indicators
          result.functionalityChecks.hasAIFeatures = content.includes('ai') || content.includes('gpt') || content.includes('generate');
          result.functionalityChecks.hasLoadingStates = content.includes('loading') || content.includes('spinner');
          result.functionalityChecks.hasErrorHandling = content.includes('error') || content.includes('try again');
          
          // Tool-specific checks
          if (tool.expectedElements) {
            result.functionalityChecks.expectedElements = {};
            tool.expectedElements.forEach(element => {
              result.functionalityChecks.expectedElements[element] = content.includes(element);
            });
          }
          
          // Check for common issues
          if (content.includes('undefined') && content.includes('undefined').length > 10) {
            result.issues.push('Multiple "undefined" values found in content');
          }
          
          if (content.includes('error') && !content.includes('error handling')) {
            result.issues.push('Error text found - may indicate broken functionality');
          }
          
          if (!result.functionalityChecks.hasInputs && !result.functionalityChecks.hasButtons) {
            result.issues.push('No interactive elements detected');
          }
          
          if (content.length < 2000) {
            result.issues.push('Page content seems minimal for a tool page');
          }
          
          // Determine status based on checks
          const functionalScore = Object.values(result.functionalityChecks).filter(Boolean).length;
          const totalChecks = Object.keys(result.functionalityChecks).length;
          const functionalPercentage = (functionalScore / totalChecks) * 100;
          
          if (result.issues.length === 0 && functionalPercentage >= 70) {
            result.status = 'FULLY_FUNCTIONAL';
          } else if (functionalPercentage >= 50) {
            result.status = 'PARTIALLY_FUNCTIONAL';
          } else if (functionalPercentage >= 30) {
            result.status = 'BASIC_FUNCTIONALITY';
          } else {
            result.status = 'LIMITED_FUNCTIONALITY';
          }
          
          // Add recommendations
          if (!result.functionalityChecks.hasAIFeatures) {
            result.recommendations.push('Consider adding AI-specific functionality indicators');
          }
          if (!result.functionalityChecks.hasLoadingStates) {
            result.recommendations.push('Add loading states for better user experience');
          }
          if (!result.functionalityChecks.hasErrorHandling) {
            result.recommendations.push('Implement error handling and user feedback');
          }
          
        } else {
          result.status = 'FAILED';
          result.issues.push(`HTTP ${res.statusCode} or empty content`);
        }

        resolve(result);
      });
    });

    req.on('error', (err) => {
      resolve({
        name: tool.name,
        route: tool.route,
        url: url.toString(),
        status: 'FAILED',
        httpStatus: 0,
        loadTime: Date.now() - startTime,
        contentLength: 0,
        functionalityChecks: {},
        issues: [`Connection error: ${err.message}`],
        recommendations: []
      });
    });

    req.setTimeout(15000, () => {
      req.destroy();
      resolve({
        name: tool.name,
        route: tool.route,
        url: url.toString(),
        status: 'FAILED',
        httpStatus: 0,
        loadTime: Date.now() - startTime,
        contentLength: 0,
        functionalityChecks: {},
        issues: ['Request timeout after 15 seconds'],
        recommendations: []
      });
    });
  });
}

async function runFunctionalQAAudit() {
  console.log('🚀 Starting Detailed Functional QA Audit');
  console.log(`🔬 Deep testing ${PRIORITY_TOOLS.length} priority tools for functionality\n`);

  const results = [];
  let fullyFunctionalCount = 0;
  let partiallyFunctionalCount = 0;
  let basicFunctionalCount = 0;
  let limitedFunctionalCount = 0;
  let failedCount = 0;

  // Test each priority tool
  for (let i = 0; i < PRIORITY_TOOLS.length; i++) {
    const tool = PRIORITY_TOOLS[i];
    console.log(`🔍 Deep Testing ${i + 1}/${PRIORITY_TOOLS.length}: ${tool.name}`);
    
    const result = await fetchPageContent(tool);
    results.push(result);

    // Update counters and display detailed status
    switch (result.status) {
      case 'FULLY_FUNCTIONAL':
        fullyFunctionalCount++;
        console.log(`   ✅ FULLY FUNCTIONAL (${result.loadTime}ms) - ${Object.values(result.functionalityChecks).filter(Boolean).length} checks passed`);
        break;
      case 'PARTIALLY_FUNCTIONAL':
        partiallyFunctionalCount++;
        console.log(`   🟡 PARTIALLY FUNCTIONAL (${result.loadTime}ms) - ${result.issues.length} issues found`);
        break;
      case 'BASIC_FUNCTIONALITY':
        basicFunctionalCount++;
        console.log(`   🟠 BASIC FUNCTIONALITY (${result.loadTime}ms) - Limited features detected`);
        break;
      case 'LIMITED_FUNCTIONALITY':
        limitedFunctionalCount++;
        console.log(`   🔴 LIMITED FUNCTIONALITY (${result.loadTime}ms) - Minimal features`);
        break;
      case 'FAILED':
        failedCount++;
        console.log(`   ❌ FAILED (${result.loadTime}ms) - ${result.issues[0] || 'Unknown error'}`);
        break;
    }

    // Brief pause between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Generate comprehensive functional report
  console.log('\n' + '='.repeat(80));
  console.log('📋 DETAILED FUNCTIONAL QA AUDIT REPORT');
  console.log('='.repeat(80));
  
  console.log(`\n📊 FUNCTIONALITY SUMMARY:`);
  console.log(`   Total Priority Tools Tested: ${PRIORITY_TOOLS.length}`);
  console.log(`   ✅ Fully Functional: ${fullyFunctionalCount}`);
  console.log(`   🟡 Partially Functional: ${partiallyFunctionalCount}`);
  console.log(`   🟠 Basic Functionality: ${basicFunctionalCount}`);
  console.log(`   🔴 Limited Functionality: ${limitedFunctionalCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);
  console.log(`   📈 Full Functionality Rate: ${(fullyFunctionalCount / PRIORITY_TOOLS.length * 100).toFixed(1)}%`);
  console.log(`   📈 Working Rate: ${((fullyFunctionalCount + partiallyFunctionalCount + basicFunctionalCount) / PRIORITY_TOOLS.length * 100).toFixed(1)}%`);

  // Detailed analysis for each tool
  console.log(`\n🔬 DETAILED TOOL ANALYSIS:`);
  results.forEach(tool => {
    console.log(`\n   📍 ${tool.name}:`);
    console.log(`      Status: ${tool.status}`);
    console.log(`      Load Time: ${tool.loadTime}ms`);
    console.log(`      Content Size: ${tool.contentLength} bytes`);
    
    console.log(`      Functionality Checks:`);
    Object.entries(tool.functionalityChecks).forEach(([check, passed]) => {
      console.log(`        ${passed ? '✅' : '❌'} ${check}`);
    });
    
    if (tool.issues.length > 0) {
      console.log(`      Issues Found:`);
      tool.issues.forEach(issue => {
        console.log(`        🔧 ${issue}`);
      });
    }
    
    if (tool.recommendations.length > 0) {
      console.log(`      Recommendations:`);
      tool.recommendations.forEach(rec => {
        console.log(`        💡 ${rec}`);
      });
    }
  });

  // Tools requiring attention
  const toolsNeedingAttention = results.filter(r => 
    r.status === 'LIMITED_FUNCTIONALITY' || 
    r.status === 'FAILED' || 
    r.issues.length > 0
  );
  
  if (toolsNeedingAttention.length > 0) {
    console.log(`\n🚨 TOOLS REQUIRING ATTENTION (${toolsNeedingAttention.length}):`);
    toolsNeedingAttention.forEach(tool => {
      console.log(`   • ${tool.name} (${tool.status})`);
      if (tool.issues.length > 0) {
        console.log(`     Issues: ${tool.issues.join(', ')}`);
      }
    });
  }

  // Performance analysis
  const workingTools = results.filter(r => r.status !== 'FAILED');
  if (workingTools.length > 0) {
    const avgLoadTime = workingTools.reduce((sum, r) => sum + r.loadTime, 0) / workingTools.length;
    const avgContentSize = workingTools.reduce((sum, r) => sum + r.contentLength, 0) / workingTools.length;
    
    console.log(`\n⚡ PERFORMANCE METRICS:`);
    console.log(`   Average Load Time: ${avgLoadTime.toFixed(0)}ms`);
    console.log(`   Average Content Size: ${(avgContentSize / 1024).toFixed(1)}KB`);
    
    const slowestTools = workingTools.sort((a, b) => b.loadTime - a.loadTime).slice(0, 3);
    console.log(`   Slowest Loading Tools:`);
    slowestTools.forEach((tool, index) => {
      console.log(`     ${index + 1}. ${tool.name}: ${tool.loadTime}ms`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('DETAILED FUNCTIONAL AUDIT COMPLETE');
  console.log('='.repeat(80));
  console.log('\n📝 SUMMARY: This audit analyzed page content and interactive elements.');
  console.log('   For complete validation, manual testing of each tool is recommended.');

  return {
    summary: {
      total: PRIORITY_TOOLS.length,
      fullyFunctional: fullyFunctionalCount,
      partiallyFunctional: partiallyFunctionalCount,
      basicFunctional: basicFunctionalCount,
      limitedFunctional: limitedFunctionalCount,
      failed: failedCount,
      functionalityRate: (fullyFunctionalCount / PRIORITY_TOOLS.length * 100).toFixed(1),
      workingRate: ((fullyFunctionalCount + partiallyFunctionalCount + basicFunctionalCount) / PRIORITY_TOOLS.length * 100).toFixed(1)
    },
    results,
    toolsNeedingAttention
  };
}

// Run the audit
runFunctionalQAAudit()
  .then(report => {
    console.log('\n✅ Functional QA Audit completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Functional QA Audit failed:', error);
    process.exit(1);
  });