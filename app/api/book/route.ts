import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const {
      serviceId,
      bookingDate,
      customerName,
      customerEmail,
      payment_reference,
      tenantId
    } = await request.json();

    if (!serviceId || !bookingDate || !customerName || !customerEmail || !payment_reference) {
      return NextResponse.json({ error: 'Missing required booking information.' }, { status: 400 });
    }

    const supabase = createClient();

    const bookingData = {
      service_id: serviceId,
      booking_date: bookingDate,
      customer_name: customerName,
      customer_email: customerEmail,
      payment_reference: payment_reference,
      status: 'confirmed',
      tenant_id: tenantId, // For whitelabel
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error('Supabase booking error:', error);
      throw new Error('Failed to create booking in database.');
    }

    return NextResponse.json({ success: true, booking: data });

  } catch (error) {
    console.error('Booking API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}