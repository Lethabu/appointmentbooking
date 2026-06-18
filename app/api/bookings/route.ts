import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/services/whatsapp/aisensy';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
  const {
    tenant_id,
    service_id,
    client_name,
    client_phone,
    start_time,
    consent_popia,
  } = await request.json();

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      tenant_id,
      service_id,
      client_name,
      client_phone,
      start_time,
      consent_popia,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await sendWhatsAppMessage({
    phone: client_phone,
    message: `Hi ${client_name}! Your booking for ${service_id} at ${start_time} has been confirmed. See you soon!`,
    tenantId: 'instylehairboutique',
  });

  return NextResponse.json({ success: true, booking: data });
}
