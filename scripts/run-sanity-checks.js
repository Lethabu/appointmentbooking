#!/usr/bin/env node

require('dotenv').config({ path: '.env.test' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runSanityChecks() {
  console.log('Running sanity checks...');

  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', '6d24ce22-575d-486f-939a-121e2cc55fe2');

    if (error) {
      console.error('Error fetching workspaces:', error.message);
    } else {
      console.log('Workspaces:', data);
    }
  } catch (error) {
    console.error('An error occurred during sanity checks:', error.message);
  }
}

runSanityChecks();
