#!/usr/bin/env node

require('dotenv').config({ path: '.env.test' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createExecFunction() {
  console.log('Creating exec function...');
  try {
    const { error } = await supabase.rpc('eval', { sql: "CREATE OR REPLACE FUNCTION exec(sql TEXT) RETURNS TABLE(result TEXT) AS $$ BEGIN RETURN QUERY EXECUTE sql; END; $$ LANGUAGE plpgsql;" });

    if (error) {
      console.error('Error creating exec function:', error.message);
    } else {
      console.log('Exec function created successfully.');
    }
  } catch (error) {
    console.error('An error occurred while creating the exec function:', error.message);
  }
}

createExecFunction();