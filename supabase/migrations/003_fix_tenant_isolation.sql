
-- supabase/migrations/003_fix_tenant_isolation.sql

CREATE OR REPLACE FUNCTION get_user_tenant_id(user_id_param UUID)
RETURNS UUID AS $$
DECLARE
  tenant_uuid UUID;
BEGIN
  -- Attempt to get tenant_id from staff_members table first (for staff and managers)
  SELECT tenant_id INTO tenant_uuid FROM staff_members WHERE user_id = user_id_param;

  -- If not found, try to get it from tenants table (for owners)
  IF NOT FOUND THEN
    SELECT id INTO tenant_uuid FROM tenants WHERE owner_id = user_id_param;
  END IF;

  -- If still not found, get it from the profiles table (for clients)
  IF NOT FOUND THEN
    SELECT tenant_id INTO tenant_uuid FROM profiles WHERE id = user_id_param;
  END IF;

  RETURN tenant_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
