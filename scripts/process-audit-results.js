#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function processResults() {
  console.log('📊 Processing audit results...');
  
  const resultsPath = 'audit-output/click-results.csv';
  const brokenPath = 'audit-output/broken.txt';
  const fakeDataPath = 'audit-output/fake-data.txt';
  
  let summary = {
    totalTests: 0,
    failures: 0,
    criticalIssues: [],
    brokenLinks: 0,
    fakeDataIssues: 0
  };
  
  // Process CSV results
  if (fs.existsSync(resultsPath)) {
    const csvContent = fs.readFileSync(resultsPath, 'utf8');
    const lines = csvContent.split('\n').slice(1); // Skip header
    
    summary.totalTests = lines.filter(line => line.trim()).length;
    
    lines.forEach(line => {
      if (line.includes('FAIL')) {
        summary.failures++;
        const parts = line.split(',');
        if (parts.length >= 5) {
          summary.criticalIssues.push({
            route: parts[0],
            element: parts[2],
            result: parts[4],
            viewport: parts[1]
          });
        }
      }
    });
  }
  
  // Process broken links
  if (fs.existsSync(brokenPath)) {
    const brokenContent = fs.readFileSync(brokenPath, 'utf8');
    summary.brokenLinks = brokenContent.split('\n').filter(line => line.trim() && !line.includes('No broken')).length;
  }
  
  // Process fake data
  if (fs.existsSync(fakeDataPath)) {
    try {
      const fakeData = JSON.parse(fs.readFileSync(fakeDataPath, 'utf8'));
      summary.fakeDataIssues = fakeData.findings?.length || 0;
    } catch (e) {
      console.log('⚠️ Could not parse fake data results');
    }
  }
  
  // Generate issue summary for GitHub Actions
  const issueSummary = `## Site Audit Results 🔍
  
**Total Tests Run**: ${summary.totalTests}
**Failed Tests**: ${summary.failures}
**Success Rate**: ${summary.totalTests > 0 ? ((summary.totalTests - summary.failures) / summary.totalTests * 100).toFixed(1) : 0}%

### Critical Issues Found: ${summary.failures}
${summary.criticalIssues.slice(0, 5).map(issue => 
  `- **${issue.route}** (${issue.viewport}): ${issue.element} - ${issue.result}`
).join('\n')}

### Other Issues:
- **Broken Links**: ${summary.brokenLinks}
- **Fake/Placeholder Data**: ${summary.fakeDataIssues} instances

### Next Steps:
1. 🔴 **Priority 1**: Fix critical interactive element failures
2. 🟡 **Priority 2**: Address broken links and navigation issues  
3. 🟢 **Priority 3**: Replace placeholder content with real data

_Audit completed at ${new Date().toLocaleString()}_`;

  fs.writeFileSync('audit-output/github-summary.md', issueSummary);
  
  // Set GitHub Actions output
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::set-output name=total_tests::${summary.totalTests}`);
    console.log(`::set-output name=failures::${summary.failures}`);
    console.log(`::set-output name=success_rate::${summary.totalTests > 0 ? ((summary.totalTests - summary.failures) / summary.totalTests * 100).toFixed(1) : 0}`);
    console.log(`::set-output name=critical_issues::${summary.failures > 0 ? 'true' : 'false'}`);
  }
  
  console.log(`✅ Results processed: ${summary.failures} failures out of ${summary.totalTests} tests`);
  
  if (summary.failures > 0) {
    console.log(`🚨 Critical issues found - check audit-output/ for details`);
    process.exit(1);
  }
}

if (require.main === module) {
  processResults();
}