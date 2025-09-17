-- supabase/migrations/001_set_tenant.sql

-- Create a function to set the tenant context
create or replace function set_tenant_context(tenant_id uuid) returns void as $$
  select set_config('app.current_tenant_id', tenant_id::text, false);
$$ language sql;

-- Create a helper function to get the current tenant ID
create or replace function get_tenant_id_from_context() returns uuid as $$
  select nullif(current_setting('app.current_tenant_id', true), '')::uuid;
$$ language sql;
