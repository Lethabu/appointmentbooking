import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { tenant_id, service_id, customer_name, customer_email, customer_phone, appointment_date, start_time } = await request.json();

    if (!service_id || !appointment_date || !start_time || !customer_name || !customer_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create or get customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert({
        tenant_id,
        name: customer_name,
        email: customer_email,
        phone: customer_phone
      }, { onConflict: 'tenant_id,email' })
      .select()
      .single();

    if (customerError) {
      return NextResponse.json({ error: customerError.message }, { status: 500 });
    }

    // Get service details for end time calculation
    const { data: service } = await supabase
      .from('services')
      .select('duration')
      .eq('id', service_id)
      .single();

    const startDateTime = new Date(`${appointment_date}T${start_time}`);
    const endDateTime = new Date(startDateTime.getTime() + (service.duration * 60000));
    const end_time = endDateTime.toTimeString().slice(0, 5);

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        tenant_id,
        customer_id: customer.id,
        service_id,
        appointment_date,
        start_time,
        end_time,
        status: 'confirmed'
      })
      .select()
      .single();

    if (appointmentError) {
      return NextResponse.json({ error: appointmentError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, appointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}