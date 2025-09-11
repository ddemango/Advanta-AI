#!/usr/bin/env node

/**
 * GitHub Actions Workflow Dispatcher
 * Triggers site audit, polls for completion, and downloads artifacts
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class GitHubAuditRunner {
  constructor(owner, repo, token) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.baseUrl = 'api.github.com';
  }

  async makeRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseUrl,
        port: 443,
        path: endpoint,
        method: method,
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Replit-Audit-Agent/1.0'
        }
      };

      if (data) {
        const body = JSON.stringify(data);
        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = Buffer.byteLength(body);
      }

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, data: body });
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async dispatchWorkflow(targetUrl = 'https://www.advanta-ai.com/') {
    console.log(`🚀 Triggering site audit for: ${targetUrl}`);
    
    const endpoint = `/repos/${this.owner}/${this.repo}/actions/workflows/site-audit.yml/dispatches`;
    const payload = {
      ref: 'main',
      inputs: {
        target: targetUrl
      }
    };

    const response = await this.makeRequest('POST', endpoint, payload);
    
    if (response.status === 204) {
      console.log('✅ Workflow dispatched successfully');
      return true;
    } else {
      console.error('❌ Failed to dispatch workflow:', response);
      return false;
    }
  }

  async pollForCompletion(maxWaitMinutes = 15) {
    console.log(`⏳ Polling for workflow completion (max ${maxWaitMinutes} minutes)...`);
    
    const startTime = Date.now();
    const maxWaitMs = maxWaitMinutes * 60 * 1000;
    
    while (Date.now() - startTime < maxWaitMs) {
      const endpoint = `/repos/${this.owner}/${this.repo}/actions/runs?event=workflow_dispatch&per_page=5`;
      const response = await this.makeRequest('GET', endpoint);
      
      if (response.status === 200 && response.data.workflow_runs) {
        const recentRun = response.data.workflow_runs[0];
        
        if (recentRun && recentRun.conclusion) {
          console.log(`✅ Workflow completed with status: ${recentRun.conclusion}`);
          return {
            success: recentRun.conclusion === 'success',
            runId: recentRun.id,
            conclusion: recentRun.conclusion,
            url: recentRun.html_url
          };
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30s
    }
    
    console.log('⏰ Workflow polling timeout');
    return { success: false, error: 'timeout' };
  }

  async downloadArtifacts(runId) {
    console.log(`📥 Downloading artifacts for run ${runId}...`);
    
    const endpoint = `/repos/${this.owner}/${this.repo}/actions/runs/${runId}/artifacts`;
    const response = await this.makeRequest('GET', endpoint);
    
    if (response.status !== 200) {
      console.error('❌ Failed to get artifacts:', response);
      return false;
    }
    
    const artifacts = response.data.artifacts || [];
    const auditArtifact = artifacts.find(a => a.name === 'audit-artifacts');
    
    if (!auditArtifact) {
      console.log('⚠️ No audit artifacts found');
      return false;
    }
    
    // Download artifact
    const downloadResponse = await this.makeRequest('GET', auditArtifact.archive_download_url);
    
    if (downloadResponse.status === 200) {
      fs.writeFileSync('audit-artifacts.zip', downloadResponse.data);
      console.log('✅ Audit artifacts downloaded successfully');
      return true;
    }
    
    console.error('❌ Failed to download artifacts');
    return false;
  }

  async createIssuesFromResults() {
    console.log('🎯 Creating GitHub issues from audit results...');
    
    if (!fs.existsSync('audit-output/click-results.csv')) {
      console.log('⚠️ No audit results found to process');
      return;
    }
    
    const csvContent = fs.readFileSync('audit-output/click-results.csv', 'utf8');
    const lines = csvContent.split('\n').slice(1); // Skip header
    
    const failures = lines.filter(line => line.includes('FAIL')).slice(0, 10); // Limit to top 10
    
    for (const failure of failures) {
      const parts = failure.split(',');
      if (parts.length >= 5) {
        const [route, viewport, element, testId, result, notes] = parts;
        
        const issueTitle = `🐛 Interactive Element Failure: ${route} (${viewport})`;
        const issueBody = `
## Issue Description
Interactive element is not functioning properly on **${route}** in **${viewport}** viewport.

**Element**: ${element}
**Test ID**: ${testId}
**Result**: ${result}
**Notes**: ${notes}

## Expected Behavior
Element should respond to user interaction with appropriate feedback (navigation, modal, or DOM change).

## Actual Behavior
${result}

## Screenshots
Check the audit artifacts for before/after screenshots.

## Labels
- bug
- ${result.includes('CRITICAL') ? 'high' : result.includes('Console Error') ? 'medium' : 'low'}
- interactive-element
- ${viewport}

## Next Steps
1. Review the element's implementation
2. Test user interaction manually
3. Fix the underlying issue
4. Re-run audit to verify fix
`;

        await this.createGitHubIssue(issueTitle, issueBody);
      }
    }
  }

  async createGitHubIssue(title, body) {
    const endpoint = `/repos/${this.owner}/${this.repo}/issues`;
    const payload = {
      title,
      body,
      labels: ['bug', 'audit-generated']
    };

    const response = await this.makeRequest('POST', endpoint, payload);
    
    if (response.status === 201) {
      console.log(`✅ Created issue: ${title}`);
    } else {
      console.log(`⚠️ Failed to create issue: ${title}`);
    }
  }

  async runFullAudit(targetUrl) {
    console.log('🎯 Starting comprehensive GitHub Actions audit...');
    
    // Step 1: Dispatch workflow
    const dispatched = await this.dispatchWorkflow(targetUrl);
    if (!dispatched) return false;
    
    // Step 2: Poll for completion
    const result = await this.pollForCompletion();
    if (!result.success) {
      console.log(`❌ Workflow failed: ${result.conclusion || result.error}`);
      return false;
    }
    
    // Step 3: Download artifacts
    const downloaded = await this.downloadArtifacts(result.runId);
    if (!downloaded) return false;
    
    // Step 4: Create issues from results
    await this.createIssuesFromResults();
    
    console.log('🎉 Full audit complete! Check GitHub issues for actionable items.');
    return true;
  }
}

async function main() {
  const owner = process.env.GITHUB_OWNER || 'your-username';
  const repo = process.env.GITHUB_REPO || 'your-repo';
  const token = process.env.GITHUB_TOKEN;
  const targetUrl = process.argv[2] || 'https://www.advanta-ai.com/';
  
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }
  
  const runner = new GitHubAuditRunner(owner, repo, token);
  const success = await runner.runFullAudit(targetUrl);
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = GitHubAuditRunner;