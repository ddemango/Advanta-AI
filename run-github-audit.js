#!/usr/bin/env node

/**
 * Trigger GitHub Actions Audit from Replit
 * This script runs the containerized audit and fetches results
 */

import GitHubAuditRunner from './scripts/trigger-audit.js';
import { execSync } from 'child_process';

async function main() {
  console.log('🚀 GITHUB ACTIONS AUDIT RUNNER');
  console.log('===============================');
  
  // Configuration
  const targetUrl = process.argv[2] || 'https://www.advanta-ai.com/';
  const owner = process.env.GITHUB_OWNER || process.env.REPL_OWNER;
  const repo = process.env.GITHUB_REPO || process.env.REPL_SLUG;
  const token = process.env.GITHUB_TOKEN;
  
  console.log(`📍 Target URL: ${targetUrl}`);
  console.log(`🔧 Repository: ${owner}/${repo}`);
  
  if (!token) {
    console.log('\n❌ GITHUB_TOKEN not found in environment variables');
    console.log('\nTo set up GitHub Actions audit:');
    console.log('1. Go to GitHub.com → Your Repo → Settings → Secrets');
    console.log('2. Add GITHUB_TOKEN with workflow permissions');
    console.log('3. Set environment variable: export GITHUB_TOKEN=your_token');
    console.log('\nFor now, running local audit...');
    
    // Fallback to local audit
    try {
      execSync('node node-enhanced-audit.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Local audit completed with issues - check audit-output/');
    }
    return;
  }
  
  try {
    const runner = new GitHubAuditRunner(owner, repo, token);
    const success = await runner.runFullAudit(targetUrl);
    
    if (success) {
      console.log('\n✅ GITHUB ACTIONS AUDIT COMPLETE!');
      console.log('📁 Check your GitHub repository for:');
      console.log('   • New issues created for critical failures');
      console.log('   • Artifacts with detailed test results');
      console.log('   • Screenshots of before/after interactions');
    } else {
      console.log('\n❌ Audit failed - check GitHub Actions logs');
    }
    
  } catch (error) {
    console.error('\n💥 Error running GitHub Actions audit:', error.message);
    console.log('\nFalling back to local audit...');
    
    // Fallback to local audit
    try {
      execSync('node node-enhanced-audit.js', { stdio: 'inherit' });
    } catch (localError) {
      console.log('Local audit completed - check audit-output/');
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}