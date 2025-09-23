#!/usr/bin/env node

// Direct SQL execution via Supabase client
require('dotenv').config({ path: '.env.test' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  console.log('🔄 Applying RLS migration directly...');
  
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/001_set_tenant.sql'), 'utf8');

    // Create function
    const { error: funcError } = await supabase.rpc('exec', {
      sql
    });

    if (funcError) {
      console.log('❌ Function creation failed:', funcError.message);
    } else {
      console.log('✅ Function created successfully');
    }

  } catch (error) {
    console.log('❌ Migration error:', error.message);
  }
}

applyMigration();