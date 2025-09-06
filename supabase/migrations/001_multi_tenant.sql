-- Enable RLS on all tables
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policies
CREATE POLICY "Tenant isolation for appointments" ON appointments
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY "Tenant isolation for clients" ON clients
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY "Tenant isolation for products" ON products
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY "Tenant isolation for services" ON services
  FOR ALL USING (tenant_id = current_setting('app.tenant_id', true));

-- Function to set tenant context
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.tenant_id', tenant_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;