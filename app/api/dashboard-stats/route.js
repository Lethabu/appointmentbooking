import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');

    const { count: todaysBookings, error: todaysBookingsError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
      .lt(
        'createdAt',
        new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
      );

    if (todaysBookingsError) {
      throw new Error(todaysBookingsError.message);
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const { data: weeklyAppointments, error: weeklyAppointmentsError } =
      await supabase
        .from('appointments')
        .select('*, service(*)')
        .gte('createdAt', sevenDaysAgo.toISOString());

    if (weeklyAppointmentsError) {
      throw new Error(weeklyAppointmentsError.message);
    }

    const weeklyRevenue = weeklyAppointments.reduce((total, appointment) => {
      return total + (appointment.service?.price_cents || 0);
    }, 0);

    const { count: totalClients, error: totalClientsError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    if (totalClientsError) {
      throw new Error(totalClientsError.message);
    }

    return NextResponse.json({
      todays_bookings: todaysBookings,
      weekly_revenue: weeklyRevenue,
      total_clients: totalClients,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
