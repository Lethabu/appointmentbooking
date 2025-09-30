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

async function verifyRoute(domain, route) {
  const url = `https://${domain}${route.path}`;
  try {
    log(`Checking route: ${url}`);
    const response = await fetchWithTimeout(url);
    const html = await response.text();
    const statusOk = response.status === 200;
    const hasTailwind = html.includes('bg-') || html.includes('text-');
    const hasTitle = html.includes('<title>');
    const hasReact = html.includes('__NEXT_DATA__');
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

async function verifyAsset(domain, asset) {
  const url = `https://${domain}${asset.path}`;
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
  log('🚀 Starting Deployment Verification', 'info');
  log('='.repeat(80), 'info');
  for (const [domain, config] of Object.entries(VERIFICATION_CONFIG)) {
    log(`\nVerifying ${config.name} (${domain})...`, 'info');
    // Test all routes
    const routeResults = [];
    for (const route of config.routes) {
      const result = await verifyRoute(domain, route);
      routeResults.push(result);
    }
    // Test assets
    const assetResults = [];
    for (const asset of config.assets) {
      const result = await verifyAsset(domain, asset);
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
    log('\n🎉 All checks passed! Deployment is successful.', 'success');
  }
  process.exit(0);
}

main().catch(error => {
  log('💥 Verification failed: ' + error, 'error');
  process.exit(1);
});