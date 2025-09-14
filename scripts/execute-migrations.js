
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigrations() {
  console.log('🔄 Running migrations...');
  const sql = fs.readFileSync(path.join(__dirname, '..', 'run-migrations.sql'), 'utf8');

  // We can't execute the whole file at once. We need to split it into individual statements.
  // This is a simple split, it might not work for complex SQL files.
  const statements = sql.split(';').filter(s => s.trim().length > 0);

  for (const statement of statements) {
    const { error } = await supabase.rpc('exec', { sql: statement });
    if (error) {
      console.error('❌ Error executing statement:', error);
      // We can choose to stop or continue on error.
      // For now, let's stop.
      process.exit(1);
    }
  }

  console.log('✅ Migrations completed successfully.');
}

runMigrations();
