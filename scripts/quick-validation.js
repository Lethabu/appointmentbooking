#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Quick Production Readiness Validation\n');

const checks = [];

function log(test, status, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${test}: ${status}${details ? ` - ${details}` : ''}`);
  checks.push({ test, status, details });
}

// Check 1: Critical files exist
const criticalFiles = [
  'app/status/page.tsx',
  'app/api/health/route.ts',
  '.github/workflows/production-deploy.yml',
  '__tests__/security.test.ts',
  'middleware.ts'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    log(`File Check - ${file}`, 'PASS');
  } else {
    log(`File Check - ${file}`, 'FAIL', 'Missing critical file');
  }
});

// Check 2: Package.json scripts
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['build', 'start', 'audit:pre-launch', 'validate:deployment'];
  
  requiredScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      log(`Script Check - ${script}`, 'PASS');
    } else {
      log(`Script Check - ${script}`, 'FAIL', 'Missing npm script');
    }
  });
} catch (error) {
  log('Package.json Check', 'FAIL', error.message);
}

// Check 3: Environment template
if (fs.existsSync('.env.example')) {
  log('Environment Template', 'PASS', '.env.example exists');
} else {
  log('Environment Template', 'FAIL', 'Missing .env.example');
}

// Check 4: Security test file
try {
  const securityTest = fs.readFileSync('__tests__/security.test.ts', 'utf8');
  if (securityTest.includes('Multi-Tenant Security Tests')) {
    log('Security Tests', 'PASS', 'Security tests implemented');
  } else {
    log('Security Tests', 'WARN', 'Security tests may be incomplete');
  }
} catch (error) {
  log('Security Tests', 'FAIL', 'Security test file not readable');
}

// Check 5: CI/CD Pipeline
try {
  const workflow = fs.readFileSync('.github/workflows/production-deploy.yml', 'utf8');
  if (workflow.includes('deploy-database-migrations')) {
    log('CI/CD Pipeline', 'PASS', 'Database migration automation configured');
  } else {
    log('CI/CD Pipeline', 'WARN', 'Database migration may not be automated');
  }
} catch (error) {
  log('CI/CD Pipeline', 'FAIL', 'Workflow file not readable');
}

// Summary
console.log('\n📊 VALIDATION SUMMARY');
console.log('='.repeat(40));

const passed = checks.filter(c => c.status === 'PASS').length;
const failed = checks.filter(c => c.status === 'FAIL').length;
const warnings = checks.filter(c => c.status === 'WARN').length;

console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️  Warnings: ${warnings}`);

const successRate = ((passed / checks.length) * 100).toFixed(1);
console.log(`📈 Success Rate: ${successRate}%`);

if (failed === 0) {
  console.log('\n🎉 VALIDATION PASSED - Core infrastructure ready!');
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Set up environment variables (.env.local)');
  console.log('2. Configure Supabase connection');
  console.log('3. Run full audit with: npm run audit:pre-launch');
  console.log('4. Follow GO_LIVE_CHECKLIST.md');
  process.exit(0);
} else {
  console.log('\n🚨 VALIDATION FAILED - Fix critical issues first');
  process.exit(1);
}