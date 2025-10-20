#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createFunction() {
  console.log('🔄 Creating tenant context function...');
  
  // Try to create a simple function that accepts any text
  const { data, error } = await supabase.rpc('sql', {
    query: `
      CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id text)
      RETURNS text AS $$
      BEGIN
        PERFORM set_config('app.tenant_id', p_tenant_id, true);
        RETURN 'success';
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
  });

  if (error) {
    console.log('❌ Error:', error.message);
    console.log('');
    console.log('🔧 MANUAL FIX REQUIRED:');
    console.log('1. Go to: https://supabase.com/dashboard/project/awrnkvjitzwzojaonrzo/sql/new');
    console.log('2. Paste and run:');
    console.log('');
    console.log('CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id text)');
    console.log('RETURNS void AS $$');
    console.log('BEGIN');
    console.log('  PERFORM set_config(\'app.tenant_id\', p_tenant_id, true);');
    console.log('END;');
    console.log('$$ LANGUAGE plpgsql SECURITY DEFINER;');
    console.log('');
    console.log('3. Then run: npm run validate:deployment');
  } else {
    console.log('✅ Function created successfully!');
  }
}

createFunction();