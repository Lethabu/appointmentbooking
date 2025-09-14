
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createExecFunction() {
  console.log('🔄 Creating exec function...');
  const { error } = await supabase.rpc('sql', {
    sql: `
      CREATE OR REPLACE FUNCTION exec(sql text)
      RETURNS void AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql;
    `
  });

  if (error) {
    console.error('❌ Error creating exec function:', error);
    process.exit(1);
  } else {
    console.log('✅ exec function created successfully.');
  }
}

createExecFunction();
