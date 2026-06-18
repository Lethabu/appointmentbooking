
require('dotenv').config({ path: '.env.test' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('🔄 Running migration...');
  const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/001_set_tenant.sql'), 'utf8');

  const { error } = await supabase.rpc('execute_sql', { sql });

  if (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  console.log('✅ Migration completed successfully.');
}

runMigration();

