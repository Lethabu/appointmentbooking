# Manual Setup Instructions

## Database Setup (Required)

### 1. Apply RLS Migration
Copy and run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS on all tables
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

-- Function to set tenant context
CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.tenant_id', p_tenant_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Test RLS (Important)
Run this to verify tenant isolation:

```sql
-- Should return 0 (no data visible without tenant context)
SET ROLE anon;
SELECT count(*) FROM appointments;

-- Reset role
RESET ROLE;
```

## Environment Variables
Ensure `.env.local` contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://awrnkvjitzwzojaonrzo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cm5rdmppdHp3em9qYW9ucnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzAzODQsImV4cCI6MjA2NTkwNjM4NH0.7ueNZeQZf6eUe-Q-Hu3vnid5SaFk3JT2Oxx0v5loAU4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cm5rdmppdHp3em9qYW9ucnpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDMzMDM4NCwiZXhwIjoyMDY1OTA2Mzg0fQ._X6Ukz5cJ3GxxZGcJq3mmmOP9egBz65QIZN0016X3p4
```

## Deployment Ready ✅

Once RLS is applied:

```bash
# Build and validate
npm run build
npm run validate:deployment

# Deploy to Vercel
vercel --prod
```

**Platform will be production ready with proper tenant isolation!**