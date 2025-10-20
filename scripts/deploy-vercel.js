#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function deployToVercel() {
  console.log('🚀 Starting Vercel deployment...\n');

  // Check if logged in to Vercel
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
  } catch (error) {
    console.log('🔐 Please login to Vercel first:');
    runCommand('vercel login', 'Vercel login');
  }

  // Build and deploy
  runCommand('npm run build', 'Building application');
  runCommand('vercel --prod', 'Deploying to production');

  console.log('\n🎉 Deployment complete!');
  console.log('📋 Next steps:');
  console.log('1. Configure custom domains in Vercel dashboard');
  console.log('2. Set up DNS records for your domains');
  console.log('3. Test the deployment');
}

if (require.main === module) {
  deployToVercel();
}

module.exports = { deployToVercel };