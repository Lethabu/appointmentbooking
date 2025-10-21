import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { booking } = await req.json();
  
  try {
    // Save to Supabase
    const { data: appt } = await supabase
      .from('appointments')
      .insert({
        salon_id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
        ...booking
      })
      .select()
      .single();

    // Sync to SuperSaaS
    await axios.post('https://www.supersaas.com/api/bookings.json', {
      schedule_id: 'Instyle_Hair_Boutique',
      full_name: booking.full_name,
      email: booking.email,
      phone: booking.phone,
      start: booking.scheduled_time
    }, {
      auth: { username: 'lY4rIwV0BfgGin_KvxdUdQ', password: 'x' }
    });

    return NextResponse.json({ success: true, id: appt.id });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}