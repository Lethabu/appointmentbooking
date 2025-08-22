import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { service_id, customer_name, customer_email, customer_phone, appointment_date, start_time } = await request.json();

    // Create or get customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert(
        {
          name: customer_name,
          email: customer_email,
          phone: customer_phone,
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (customerError) {
      throw new Error(customerError.message);
    }

    // Get service details for end time calculation
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('duration_minutes')
      .eq('id', service_id)
      .single();

    if (serviceError) {
      throw new Error(serviceError.message);
    }

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const startDateTime = new Date(`${appointment_date}T${start_time}`);
    const endDateTime = new Date(startDateTime.getTime() + (service.duration_minutes * 60000));

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        serviceId: service_id,
        staffId: 'clerk_user_id', // TODO: Replace with actual staff ID
        scheduled_time: startDateTime,
        duration: service.duration_minutes,
        clientEmail: customer.email,
        status: 'CONFIRMED',
      })
      .select()
      .single();

    if (appointmentError) {
      throw new Error(appointmentError.message);
    }

    return NextResponse.json({ success: true, appointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}