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

// Utility functions
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

// Core verification functions
// ...rest of user-provided code...
      statusOk,
      hasTailwind,
      hasTitle,
      hasReact,
      success: statusOk && hasTailwind && hasTitle && hasReact
    };
    
  } catch (error) {
    console.log(`   Error: ❌ ${error.message}`);
    return {
      route,
      success: false,
      error: error.message
    };
  }
}

async function checkAssets() {
  console.log(`\n🖼️  Testing Assets:`);
  
  const assets = [
    '/tenants/instyle/hero.webp',
    '/tenants/instyle/logo.png'
  ];
  
  const results = [];
  
  for (const asset of assets) {
    const url = `https://${DOMAIN}${asset}`;
    try {
      const response = await makeRequest(url);
      const success = response.statusCode === 200;
      console.log(`   ${asset}: ${success ? '✅' : '❌'} (${response.statusCode})`);
      results.push({ asset, success, statusCode: response.statusCode });
    } catch (error) {
      console.log(`   ${asset}: ❌ ${error.message}`);
      results.push({ asset, success: false, error: error.message });
    }
  }
  
  return results;
}

async function main() {
  console.log('🚀 Starting Deployment Verification');
  console.log(`📍 Domain: ${DOMAIN}`);
  console.log('=' .repeat(50));
  
  // Test all routes
  const routeResults = [];
  for (const route of ROUTES_TO_TEST) {
    const result = await checkRoute(route);
    routeResults.push(result);
  }
  
  // Test assets
  const assetResults = await checkAssets();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(50));
  
  const successfulRoutes = routeResults.filter(r => r.success).length;
  const successfulAssets = assetResults.filter(a => a.success).length;
  
  console.log(`Routes: ${successfulRoutes}/${routeResults.length} ✅`);
  console.log(`Assets: ${successfulAssets}/${assetResults.length} ✅`);
  
  const overallSuccess = successfulRoutes === routeResults.length && 
                        successfulAssets === assetResults.length;
  
  console.log(`\n🎯 Overall Status: ${overallSuccess ? '✅ PASS' : '❌ FAIL'}`);
  
  if (!overallSuccess) {
    console.log('\n❌ Issues found:');
    routeResults.filter(r => !r.success).forEach(r => {
      console.log(`   - Route ${r.route}: ${r.error || 'Failed checks'}`);
    });
    assetResults.filter(a => !a.success).forEach(a => {
      console.log(`   - Asset ${a.asset}: ${a.error || `Status ${a.statusCode}`}`);
    });
    process.exit(1);
  }
  
  console.log('\n🎉 All checks passed! Deployment is successful.');
  process.exit(0);
}

main().catch(error => {
  console.error('💥 Verification failed:', error);
  process.exit(1);
});