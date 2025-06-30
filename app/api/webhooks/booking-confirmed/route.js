import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  const { appointment_id } = await req.json();

  if (!appointment_id) {
    return NextResponse.json({ error: 'Missing appointment_id' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Fetch appointment details
  const { data: appointment, error: apptError } = await supabase
    .from('appointments')
    .select('id, start_time, client_name, client_phone, service_id, salon_id')
    .eq('id', appointment_id)
    .single();

  if (apptError || !appointment) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  // Fetch salon info
  const { data: salon } = await supabase
    .from('salons')
    .select('name, whatsapp_enabled')
    .eq('id', appointment.salon_id)
    .single();

  // Fetch service info
  const { data: service } = await supabase
    .from('services')
    .select('name')
    .eq('id', appointment.service_id)
    .single();

  // Compose reminder message
  const message = `Hi ${appointment.client_name}, your booking for ${service?.name || 'a service'} at ${salon?.name || 'the salon'} is confirmed for ${new Date(appointment.start_time).toLocaleString()}.`;

  // Insert into reminder_queue
  const { error: queueError } = await supabase
    .from('reminder_queue')
    .insert({
      appointment_id,
      send_at: appointment.start_time,
      message,
      phone: appointment.client_phone,
      sent: false
    });

  if (queueError) {
    return NextResponse.json({ error: 'Failed to queue reminder' }, { status: 500 });
  }

  return NextResponse.json({ queued: true });
}
