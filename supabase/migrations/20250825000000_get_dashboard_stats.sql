-- Supabase RPC for get_dashboard_stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(salon_id_param uuid)
RETURNS TABLE(total_appointments bigint, total_revenue numeric, latest_booking timestamp with time zone)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM appointments WHERE salon_id = salon_id_param) as total_appointments,
    (SELECT SUM(price) FROM services s JOIN appointments a ON s.id = a.service_id WHERE a.salon_id = salon_id_param) as total_revenue,
    (SELECT MAX(created_at) FROM appointments WHERE salon_id = salon_id_param) as latest_booking;
END;
$$;