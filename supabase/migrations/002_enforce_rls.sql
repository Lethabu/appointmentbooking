-- Critical RLS Enforcement Migration
-- Ensures all tables have proper tenant isolation

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Tenant isolation for appointments" ON appointments;
DROP POLICY IF EXISTS "Tenant isolation for clients" ON clients;
DROP POLICY IF EXISTS "Tenant isolation for products" ON products;
DROP POLICY IF EXISTS "Tenant isolation for services" ON services;

-- Ensure RLS is enabled on all tables
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create strict tenant isolation policies
CREATE POLICY "appointments_tenant_isolation" ON appointments
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY "clients_tenant_isolation" ON clients
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY "products_tenant_isolation" ON products
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY "services_tenant_isolation" ON services
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));

-- Ensure tenant context function exists
CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.tenant_id', p_tenant_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test function to validate RLS
CREATE OR REPLACE FUNCTION test_rls_isolation()
RETURNS TABLE(table_name text, isolated boolean) AS $$
BEGIN
  -- Test without tenant context (should return 0 rows)
  PERFORM set_config('app.tenant_id', '', true);
  
  RETURN QUERY
  SELECT 'appointments'::text, (SELECT count(*) FROM appointments) = 0;
  
  RETURN QUERY
  SELECT 'clients'::text, (SELECT count(*) FROM clients) = 0;
  
  RETURN QUERY
  SELECT 'products'::text, (SELECT count(*) FROM products) = 0;
  
  RETURN QUERY
  SELECT 'services'::text, (SELECT count(*) FROM services) = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;