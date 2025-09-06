CREATE OR REPLACE FUNCTION get_dashboard_stats(p_tenant_id uuid)
RETURNS TABLE (
    todays_bookings bigint,
    weekly_revenue numeric
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(CASE WHEN appointment_date = CURRENT_DATE THEN 1 ELSE NULL END) AS todays_bookings,
        COALESCE(SUM(price), 0) AS weekly_revenue
    FROM
        appointments
    WHERE
        tenant_id = p_tenant_id
        AND appointment_date >= CURRENT_DATE - INTERVAL '7 days';
END;
$$;