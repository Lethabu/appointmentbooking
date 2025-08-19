-- Live Dashboard RPC for Real-Time Tenant Data
CREATE OR REPLACE FUNCTION get_tenant_dashboard(tenant_uuid uuid)
RETURNS TABLE (
  today_bookings bigint,
  today_revenue numeric,
  next_5_appointments jsonb,
  loyalty_top_5 jsonb,
  mood_average numeric,
  social_reach jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Today's bookings count
    (SELECT COUNT(*) FROM appointments 
     WHERE tenant_id = tenant_uuid 
     AND appointment_date = CURRENT_DATE) as today_bookings,
    
    -- Today's revenue in cents
    (SELECT COALESCE(SUM(s.price), 0) FROM appointments a
     JOIN services s ON a.service_id = s.id
     WHERE a.tenant_id = tenant_uuid 
     AND a.appointment_date = CURRENT_DATE) as today_revenue,
    
    -- Next 5 appointments
    (SELECT jsonb_agg(jsonb_build_object(
      'id', a.id,
      'customer_name', c.name,
      'service_name', s.name,
      'appointment_time', a.start_time,
      'status', a.status
    )) FROM (
      SELECT a.*, c.name, s.name as service_name
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      JOIN services s ON a.service_id = s.id
      WHERE a.tenant_id = tenant_uuid 
      AND a.appointment_date >= CURRENT_DATE
      ORDER BY a.appointment_date, a.start_time
      LIMIT 5
    ) a) as next_5_appointments,
    
    -- Top 5 loyal customers
    (SELECT jsonb_agg(jsonb_build_object(
      'name', c.name,
      'visit_count', COUNT(a.id),
      'total_spent', COALESCE(SUM(s.price), 0)
    )) FROM customers c
     LEFT JOIN appointments a ON c.id = a.customer_id
     LEFT JOIN services s ON a.service_id = s.id
     WHERE c.tenant_id = tenant_uuid
     GROUP BY c.id, c.name
     ORDER BY COUNT(a.id) DESC
     LIMIT 5) as loyalty_top_5,
    
    -- Average mood score (placeholder for v10)
    8.2::numeric as mood_average,
    
    -- Social media reach (placeholder for v10)
    jsonb_build_object(
      'instagram_followers', 1250,
      'tiktok_views', 8500,
      'conversion_rate', 12.5
    ) as social_reach;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;