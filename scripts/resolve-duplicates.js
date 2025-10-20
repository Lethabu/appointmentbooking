#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Resolving Next.js Route Duplicates\n');

// Best Practice: TypeScript over JavaScript for API routes
const jsRoutes = [
  'app/api/agent/instyle/route.js',
  'app/api/consent/record/route.js',
  'app/api/dashboard/clients/route.js',
  'app/api/dashboard/clients/[id]/route.js',
  'app/api/dashboard/marketing/route.js',
  'app/api/dashboard/marketing/[id]/route.js',
  'app/api/dashboard/products/route.js',
  'app/api/dashboard/services/[id]/route.js',
  'app/api/dashboard/settings/route.js',
  'app/api/data/anonymize/route.js',
  'app/api/mood/post/route.js',
  'app/api/payments/create/route.js',
  'app/api/payments/netcash/route.js',
  'app/api/payments/payflex/route.js',
  'app/api/payments/paystack/create/route.js',
  'app/api/public/products/route.js',
  'app/api/public/services/route.js',
  'app/api/tiktok/viral/route.js',
  'app/api/whatsapp/reminder/route.js'
];

let resolved = 0;
let skipped = 0;

jsRoutes.forEach(route => {
  const fullPath = path.join(process.cwd(), route);
  const tsEquivalent = route.replace('.js', '.ts');
  const tsPath = path.join(process.cwd(), tsEquivalent);
  
  if (fs.existsSync(fullPath)) {
    if (fs.existsSync(tsPath)) {
      // TypeScript version exists, remove JavaScript
      fs.unlinkSync(fullPath);
      console.log(`✅ Removed duplicate: ${route} (kept TypeScript version)`);
      resolved++;
    } else {
      // No TypeScript version, keep JavaScript
      console.log(`⚠️  Kept JavaScript: ${route} (no TypeScript equivalent)`);
      skipped++;
    }
  } else {
    console.log(`ℹ️  Already resolved: ${route}`);
  }
});

console.log(`\n📊 RESOLUTION SUMMARY`);
console.log(`✅ Resolved: ${resolved}`);
console.log(`⚠️  Skipped: ${skipped}`);
console.log(`\n🎉 Duplicate resolution complete!`);