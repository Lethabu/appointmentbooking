import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id') || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

    const { data, error } = await supabase
      .rpc('get_dashboard_stats', { tenant_uuid: tenant_id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0] || {
      todays_bookings: 0,
      weekly_revenue: 0,
      total_clients: 0,
      avg_rating: 4.8
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}