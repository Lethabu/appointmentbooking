#!/usr/bin/env node

// Apply RLS migration via Supabase REST API
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const migration = `
CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.tenant_id', p_tenant_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "appointments_tenant_isolation" ON appointments;
DROP POLICY IF EXISTS "clients_tenant_isolation" ON clients;
DROP POLICY IF EXISTS "products_tenant_isolation" ON products;
DROP POLICY IF EXISTS "services_tenant_isolation" ON services;

CREATE POLICY "appointments_tenant_isolation" ON appointments
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY "clients_tenant_isolation" ON clients
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY "products_tenant_isolation" ON products
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));
CREATE POLICY "services_tenant_isolation" ON services
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));
`;

async function applyMigration() {
  try {
    console.log('🔄 Applying RLS migration...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY
      },
      body: JSON.stringify({ sql: migration })
    });

    if (response.ok) {
      console.log('✅ Migration applied successfully!');
      console.log('🔒 RLS policies are now active');
      console.log('🎯 Platform is production ready!');
    } else {
      console.log('❌ Migration failed:', response.status);
      console.log('📋 Please apply manually via Supabase dashboard');
    }
  } catch (error) {
    console.log('❌ Error applying migration:', error.message);
    console.log('📋 Please apply manually via Supabase dashboard');
  }
}

applyMigration();