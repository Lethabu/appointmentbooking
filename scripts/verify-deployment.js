<<<<<<< HEAD
#!/usr/bin/env node

// ================================================================
// DEPLOYMENT VERIFICATION SUITE
// Run this script after each deployment to ensure platform health
// ================================================================

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration for all tenant verification
const VERIFICATION_CONFIG = {
  'instylehairboutique.co.za': {
    name: 'InStyle Hair Boutique',
    routes: [
      { path: '/', name: 'Home', critical: true },
      { path: '/book', name: 'Booking', critical: true },
      { path: '/shop', name: 'Shop', critical: false },
      { path: '/services', name: 'Services', critical: true }
    ],
    assets: [
      { path: '/tenants/instyle/hero.webp', name: 'Hero Image', critical: true },
      { path: '/tenants/instyle/logo.png', name: 'Logo', critical: true }
    ],
    expectedContent: {
      '/': ['InStyle Hair Boutique', 'Where Style is Perfected'],
      '/book': ['book', 'appointment', 'service'],
      '/services': ['hair', 'service', 'pricing']
    }
  },
  'www.appointmentbooking.co.za': {
    name: 'AppointmentBooking Platform',
    routes: [
      { path: '/', name: 'Platform Home', critical: true },
      { path: '/features', name: 'Features', critical: false }
    ],
    assets: [
      { path: '/platform/logo.png', name: 'Platform Logo', critical: true }
    ]
  }
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'InStyle-Health-Check/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function verifyRouteLocal(domain, port, protocol, route) {
  const url = `${protocol}://${domain}:${port}${route.path}`;
  try {
    log(`Checking route: ${url}`);
    const response = await fetchWithTimeout(url);
    const html = await response.text();
    const statusOk = response.status === 200;
    const hasTailwind = html.includes('bg-') || html.includes('text-') || html.includes('tailwind');
    const hasTitle = html.includes('<title>');
    const hasReact = html.includes('__NEXT_DATA__') || html.includes('react');
    return {
      route: route.path,
      statusOk,
      hasTailwind,
      hasTitle,
      hasReact,
      success: statusOk && hasTailwind && hasTitle && hasReact
    };
  } catch (error) {
    log(`   Error: ❌ ${error.message}`);
    return {
      route: route.path,
      success: false,
      error: error.message
    };
  }
}

async function verifyAssetLocal(domain, port, protocol, asset) {
  const url = `${protocol}://${domain}:${port}${asset.path}`;
  try {
    log(`Checking asset: ${url}`);
    const response = await fetchWithTimeout(url, { method: 'HEAD' });
    const success = response.status === 200;
    return {
      asset: asset.path,
      success,
      statusCode: response.status
    };
  } catch (error) {
    log(`   ${asset.path}: ❌ ${error.message}`);
    return {
      asset: asset.path,
      success: false,
      error: error.message
    };
  }
}

async function main() {
  log('🚀 Starting Local Deployment Verification', 'info');
  log('='.repeat(80), 'info');
  const domain = 'localhost';
  const port = 3000;
  const protocol = 'http';
  const config = {
    name: 'Local Appointment Booking Platform',
    routes: [
      { path: '/', name: 'Home', critical: true },
      { path: '/book', name: 'Booking', critical: true },
      { path: '/services', name: 'Services', critical: true },
      { path: '/api/health', name: 'Health Check', critical: false } // Add if exists
    ],
    assets: [
      { path: '/placeholder-logo.svg', name: 'Placeholder Logo', critical: true },
      { path: '/favicon.ico', name: 'Favicon', critical: false }
    ],
    expectedContent: {
      '/': ['Appointment', 'Booking', 'Platform'],
      '/book': ['book', 'appointment'],
      '/services': ['service']
    }
  };
  log(`\nVerifying Local Platform (http://${domain}:${port})...`, 'info');
  // Test all routes
  const routeResults = [];
  for (const route of config.routes) {
    const result = await verifyRouteLocal(domain, port, protocol, route);
    routeResults.push(result);
  }
  // Test assets
  const assetResults = [];
  for (const asset of config.assets) {
    const result = await verifyAssetLocal(domain, port, protocol, asset);
    assetResults.push(result);
  }
  // Summary
  log('\n' + '='.repeat(50), 'info');
  log('📊 VERIFICATION SUMMARY', 'info');
  log('='.repeat(50), 'info');
  const successfulRoutes = routeResults.filter(r => r.success).length;
  const successfulAssets = assetResults.filter(a => a.success).length;
  log(`Routes: ${successfulRoutes}/${routeResults.length} ✅`, 'info');
  log(`Assets: ${successfulAssets}/${assetResults.length} ✅`, 'info');
  const overallSuccess = successfulRoutes === routeResults.length && successfulAssets === assetResults.length;
  log(`\n🎯 Overall Status: ${overallSuccess ? '✅ PASS' : '❌ FAIL'}`, overallSuccess ? 'success' : 'error');
  if (!overallSuccess) {
    log('\n❌ Issues found:', 'error');
    routeResults.filter(r => !r.success).forEach(r => {
      log(`   - Route ${r.route}: ${r.error || 'Failed checks'}`, 'error');
    });
    assetResults.filter(a => !a.success).forEach(a => {
      log(`   - Asset ${a.asset}: ${a.error || `Status ${a.statusCode}`}`, 'error');
    });
    process.exit(1);
  }
  log('\n🎉 All checks passed! Local simulation successful.', 'success');
  process.exit(0);
}

main().catch(error => {
  log('💥 Verification failed: ' + error, 'error');
  process.exit(1);
});
=======
const axios = require('axios');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function verifyDeployment() {
  console.log('🔍 Verifying InStyle E-Commerce Deployment');
  console.log('==========================================');

  const tests = [
    {
      name: 'Home Page',
      url: `${BASE_URL}/instylehairboutique`,
      expected: 'InStyle Hair Boutique'
    },
    {
      name: 'Shop Page',
      url: `${BASE_URL}/instylehairboutique/shop`,
      expected: 'Shop Products'
    },
    {
      name: 'API Health',
      url: `${BASE_URL}/api/health`,
      expected: 'ok'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n🧪 Testing: ${test.name}`);
      const response = await axios.get(test.url, { timeout: 10000 });
      
      if (response.status === 200 && response.data.includes?.(test.expected)) {
        console.log(`✅ PASS: ${test.name}`);
        passed++;
      } else {
        console.log(`❌ FAIL: ${test.name} - Unexpected response`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ FAIL: ${test.name} - ${error.message}`);
      failed++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! InStyle E-Commerce is ready for production.');
    console.log('\n🌐 Live URLs:');
    console.log(`   - Home: ${BASE_URL}/instylehairboutique`);
    console.log(`   - Shop: ${BASE_URL}/instylehairboutique/shop`);
    console.log(`   - Book: ${BASE_URL}/book/instylehairboutique`);
  } else {
    console.log('\n⚠️ Some tests failed. Please check the deployment.');
    process.exit(1);
  }
}

// Manual verification checklist
function printManualChecklist() {
  console.log('\n📋 Manual Verification Checklist:');
  console.log('==================================');
  console.log('□ Home page loads with InStyle branding');
  console.log('□ Shop page displays 5 products');
  console.log('□ Add to cart functionality works');
  console.log('□ Cart persists across page refreshes');
  console.log('□ PayStack checkout flow completes');
  console.log('□ Success page clears cart');
  console.log('□ Mobile responsive design');
  console.log('□ AI chat responds correctly');
  console.log('□ WhatsApp bot configuration uploaded');
  console.log('□ Social media links work');
  console.log('\n🚀 Production Readiness:');
  console.log('□ SSL certificate configured');
  console.log('□ Domain DNS pointing correctly');
  console.log('□ PayStack live keys configured');
  console.log('□ WhatsApp Business API connected');
  console.log('□ Analytics tracking enabled');
}

if (require.main === module) {
  verifyDeployment().then(() => {
    printManualChecklist();
  });
}

module.exports = { verifyDeployment };
>>>>>>> origin/feat/instyle-whitelabel
