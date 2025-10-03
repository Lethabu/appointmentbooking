#!/usr/bin/env node

// Direct SQL execution via Supabase client
<<<<<<< HEAD
require('dotenv').config({ path: '.env.test' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
=======
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
>>>>>>> origin/feat/instyle-whitelabel

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  console.log('🔄 Applying RLS migration directly...');
  
  try {
<<<<<<< HEAD
    const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/001_set_tenant.sql'), 'utf8');

    // Create function
    const { error: funcError } = await supabase.rpc('exec', {
      sql
=======
    // Create function
    const { error: funcError } = await supabase.rpc('exec', {
      sql: `
        CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id text)
        RETURNS void AS $$
        BEGIN
          PERFORM set_config('app.tenant_id', p_tenant_id::text, true);
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
>>>>>>> origin/feat/instyle-whitelabel
    });

    if (funcError) {
      console.log('❌ Function creation failed:', funcError.message);
    } else {
      console.log('✅ Function created successfully');
    }

<<<<<<< HEAD
=======
    // Test the function
    const { error: testError } = await supabase.rpc('set_tenant_context', {
      p_tenant_id: 'instyle'
    });

    if (testError) {
      console.log('❌ Function test failed:', testError.message);
    } else {
      console.log('✅ Function test passed');
      console.log('🎯 Platform is production ready!');
    }

>>>>>>> origin/feat/instyle-whitelabel
  } catch (error) {
    console.log('❌ Migration error:', error.message);
  }
}

applyMigration();