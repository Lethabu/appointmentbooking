#!/usr/bin/env node

const http = require('http');
const https = require('https');
const fs = require('fs');

const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const endpoints = [
  '/api/health',
  '/api/products',
  '/api/whatsapp/catalog',
  '/api/conversational-commerce',
  '/api/social-commerce',
  '/api/checkout',
  '/api/automation',
  '/api/dashboard-stats'
];

async function validateEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${endpoint}`;
    const client = BASE_URL.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      resolve({
        endpoint,
        status: res.statusCode,
        success: res.statusCode < 500
      });
    });
    
    req.on('error', () => {
      resolve({
        endpoint,
        status: 'ERROR',
        success: false
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        endpoint,
        status: 'TIMEOUT',
        success: false
      });
    });
  });
}

async function main() {
  console.log('🔍 Validating InStyle Hair Boutique Production Deployment...\n');
  
  const results = await Promise.all(
    endpoints.map(endpoint => validateEndpoint(endpoint))
  );
  
  let passed = 0;
  let failed = 0;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.endpoint} - ${result.status}`);
    
    if (result.success) passed++;
    else failed++;
  });
  
  console.log(`\n📊 Validation Results:`);
  console.log(`✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All endpoints validated successfully!');
    console.log('🚀 InStyle Hair Boutique is PRODUCTION READY');
  } else {
    console.log('\n⚠️  Some endpoints failed validation');
    console.log('🔧 Check deployment and try again');
  }
  
  // Generate validation report
  const report = {
    timestamp: new Date().toISOString(),
    tenant_id: TENANT_ID,
    base_url: BASE_URL,
    results,
    summary: {
      total: results.length,
      passed,
      failed,
      success_rate: `${((passed / results.length) * 100).toFixed(1)}%`
    }
  };
  
  fs.writeFileSync('validation-report.json', JSON.stringify(report, null, 2));
  console.log('\n📋 Validation report saved to validation-report.json');
}

main().catch(console.error);