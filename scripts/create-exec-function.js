require('dotenv').config({ path: '.env.test' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createExecFunction() {
  console.log('🔄 Creating exec function...');
  const { data, error } = await supabase
    .rpc('sql', {
      sql: `
      create function exec(sql text) returns void as $$
      begin
        execute sql;
      end;
      $$ language plpgsql;
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
