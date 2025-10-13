-- 003_booking_rpc.sql
-- RPC for efficient overlap checking with locking

CREATE OR REPLACE FUNCTION get_overlapping_bookings(
  p_tenant_id uuid,
  p_staff_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz
)
RETURNS TABLE(booking_id uuid, start_time timestamptz, end_time timestamptz)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.start_time, b.end_time
  FROM bookings b
  WHERE b.tenant_id = p_tenant_id
    AND b.staff_id = p_staff_id
    AND b.status IN ('confirmed', 'pending_payment')
    AND NOT (b.end_time <= p_start_time OR b.start_time >= p_end_time)
  FOR UPDATE; -- Lock rows to prevent race conditions
END;
$$;