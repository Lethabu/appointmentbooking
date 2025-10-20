#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env
require('dotenv').config();

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_URL', 
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE',
  'PAYSTACK_SECRET'
];

function setupVercelEnv() {
  console.log('Setting up Vercel environment variables...');
  
  // Check if .env exists
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Copy .env.example to .env and fill in your values.');
    process.exit(1);
  }

  // Set environment variables in Vercel
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (!value) {
      console.warn(`⚠️  ${envVar} not found in .env`);
      return;
    }

    try {
      execSync(`vercel env add ${envVar} production`, { 
        input: value,
        stdio: ['pipe', 'inherit', 'inherit']
      });
      console.log(`✅ Set ${envVar}`);
    } catch (error) {
      console.error(`❌ Failed to set ${envVar}:`, error.message);
    }
  });

  console.log('✅ Vercel environment setup complete');
}

if (require.main === module) {
  setupVercelEnv();
}

module.exports = { setupVercelEnv };