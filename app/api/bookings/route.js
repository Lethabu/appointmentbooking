
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const {
    salon_id,
    service_id,
    user_id,
    scheduled_time,
    notes,
    client_name,
    client_phone,
  } = await req.json();

  // Input validation
  if (!salon_id || !service_id || !user_id || !scheduled_time || !client_name || !client_phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      salon_id,
      service_id,
      user_id,
      scheduled_time,
      status: 'pending', // Default status
      notes,
      client_name,
      client_phone
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }

  return NextResponse.json(data);
}
