#!/usr/bin/env node

require('dotenv').config({ path: '.env.test' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listTables() {
  console.log('Listing tables...');
  try {
    const { data, error } = await supabase.rpc('exec', { sql: "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema');" });

    if (error) {
      console.error('Error listing tables:', error.message);
      // The direct rpc call might fail if the exec function expects a different format or does not return data.
      // As a fallback, let's try to query a known table to see if the connection is working.
      const { data: testData, error: testError } = await supabase.from('orders').select('id').limit(1);
      if(testError) {
        console.error('Fallback query failed:', testError.message)
      } else {
        console.log('Fallback query succeeded. The issue is with the rpc call to list tables.', testData);
      }

    } else {
      console.log('Tables:', data);
    }
  } catch (error) {
    console.error('An error occurred while listing tables:', error.message);
  }
}

listTables();
