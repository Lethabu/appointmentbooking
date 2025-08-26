-- A secure RPC function to get dashboard stats for the current tenant.
-- The function respects RLS by using the tenant_id from the JWT claim.

CREATE OR REPLACE FUNCTION get_dashboard_stats() -- No parameters for better security
RETURNS TABLE (
  todays_appointments bigint,
  weekly_revenue numeric,
  total_customers bigint
)
LANGUAGE plpgsql
SECURITY DEFINER -- To bypass RLS for aggregation, but we will filter by tenant_id manually
AS $$
DECLARE
  current_tenant_id uuid;
BEGIN
  -- Get the tenant_id from the JWT claim.
  -- Fallback to null if not present.
    RAISE EXCEPTION 'Tenant ID not found in JWT';
  END IF;

  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE a.time::date = CURRENT_DATE) AS todays_appointments,
    COALESCE(SUM(s.price_cents) FILTER (WHERE a.time >= date_trunc('week', CURRENT_DATE) AND a.status = 'completed'), 0) / 100.0 AS weekly_revenue,
    COUNT(DISTINCT a.user_id) AS total_customers
  FROM public.appointments a
  LEFT JOIN public.services s ON a.service_id = s.id
  WHERE a.tenant_id = current_tenant_id;
END;
$$;

-- Grant execute permission to authenticated users
-- Note: The function name in the grant needs to match the new signature if it changes.
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;

