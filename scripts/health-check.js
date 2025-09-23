#!/usr/bin/env node

const https = require('https');
const http = require('http');

const endpoints = [
  'https://your-platform-domain.com/api/health',
  'https://instylehairboutique.co.za/api/health'
];

async function checkEndpoint(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        ok: res.statusCode === 200
      });
    });
    
    req.on('error', () => {
      resolve({
        url,
        status: 0,
        ok: false
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        ok: false
      });
    });
  });
}

async function main() {
  console.log('🔍 Running health checks...');
  
  const results = await Promise.all(
    endpoints.map(checkEndpoint)
  );
  
  const failed = results.filter(r => !r.ok);
  
  if (failed.length > 0) {
    console.error('❌ Health check failed:');
    failed.forEach(r => {
      console.error(`  ${r.url}: ${r.status}`);
    });
    process.exit(1);
  }
  
  console.log('✅ All health checks passed');
  results.forEach(r => {
    console.log(`  ${r.url}: ${r.status}`);
  });
}

main().catch(console.error);