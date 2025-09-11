#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function main() {
  const targetUrl = process.argv[2] || 'https://www.advanta-ai.com/';
  
  console.log(`🚀 Preparing audit for: ${targetUrl}`);
  
  // Ensure directories exist
  const dirs = ['audit-output', 'audit-output/screenshots'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
  
  // Write target URL to environment
  const envContent = `TARGET_URL=${targetUrl}\n`;
  fs.writeFileSync('.env.audit', envContent);
  
  console.log('✅ Audit environment prepared');
}

if (require.main === module) {
  main();
}