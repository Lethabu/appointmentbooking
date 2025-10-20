-- 002_rls_policies.sql

-- Enable RLS and create restrictive policies using jwt.claims.tenant_id

ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS tenant_only_services ON services
  USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);

ALTER TABLE IF EXISTS staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS tenant_only_staff ON staff
  USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);

ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS tenant_only_bookings ON bookings
  USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);

ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS tenant_only_users ON users
  USING (tenant_id = current_setting('jwt.claims.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('jwt.claims.tenant_id')::uuid);

-- Note: Server-side actions using SERVICE_ROLE bypass RLS. Keep SERVICE_ROLE key secret.