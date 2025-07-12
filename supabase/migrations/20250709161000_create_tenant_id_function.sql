CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN nullif(current_setting('app.current_tenant_id', true), '')::UUID;
EXCEPTION WHEN others THEN
  RETURN null;
END;
$$ LANGUAGE plpgsql;