#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Runs automated checks on the live domain to verify all fixes are working
 */

const https = require('https');
const { URL } = require('url');

const DOMAIN = 'instylehairboutique.co.za';
const ROUTES_TO_TEST = ['/', '/book', '/shop', '/services'];

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: data
        });
      });
    });
    
    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkRoute(route) {
  const url = `https://${DOMAIN}${route}`;
  console.log(`\n🔍 Testing: ${url}`);
  
  try {
    const response = await makeRequest(url);
    
    // Check status code
    const statusOk = response.statusCode === 200;
    console.log(`   Status: ${response.statusCode} ${statusOk ? '✅' : '❌'}`);
    
    // Check for Tailwind CSS classes in HTML
    const hasTailwind = response.body.includes('bg-purple-') || response.body.includes('text-purple-');
    console.log(`   Tailwind: ${hasTailwind ? '✅ Found' : '❌ Missing'}`);
    
    // Check for proper meta tags
    const hasTitle = response.body.includes('<title>');
    console.log(`   Meta Tags: ${hasTitle ? '✅ Present' : '❌ Missing'}`);
    
    // Check for React hydration
    const hasReact = response.body.includes('__NEXT_DATA__');
    console.log(`   React SSR: ${hasReact ? '✅ Working' : '❌ Failed'}`);
    
    return {
      route,
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