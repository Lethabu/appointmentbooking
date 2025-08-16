import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tenantId } = req.query;
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    // Today's bookings
    const { count: todaysBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('start_time', today)
      .lt('start_time', today + 'T23:59:59');

    // Weekly revenue
    const { data: weeklyBookings } = await supabase
      .from('bookings')
      .select('services(price_zar)')
      .eq('tenant_id', tenantId)
      .gte('start_time', weekStart);

    const weeklyRevenue = weeklyBookings?.reduce((sum, booking) => 
      sum + (booking.services?.price_zar || 0), 0) || 0;

    // Monthly bookings
    const { count: monthlyBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('start_time', monthStart);

    res.status(200).json({
      todays_bookings: todaysBookings || 0,
      weekly_revenue: weeklyRevenue / 100,
      monthly_bookings: monthlyBookings || 0,
      pending_payments: 0
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}