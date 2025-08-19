import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

    const appointment = {
      tenant_id: tenantId,
      customer_name: body.name,
      customer_email: body.email,
      customer_phone: body.phone,
      service_name: body.service,
      appointment_date: body.date,
      start_time: body.time,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };

    // Simulate successful booking
    const bookingId = `BK${Date.now()}`;
    
    // Schedule WhatsApp reminder
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/whatsapp/reminder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment_id: bookingId })
    });

    return NextResponse.json({ 
      success: true, 
      booking_id: bookingId,
      message: 'Appointment booked successfully! You will receive a WhatsApp confirmation.'
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}