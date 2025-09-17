import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const body = await request.json();

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant not identified' },
        { status: 400 },
      );
    }

    // Get tenant/salon ID
    const { data: salon } = await supabase
      .from('salons')
      .select('id')
      .eq('subdomain', tenantId)
      .single();

    if (!salon) {
      return NextResponse.json({ error: 'Salon not found' }, { status: 404 });
    }

    // Create emergency appointment record
    const appointmentData = {
      salon_id: salon.id,
      service_id: body.serviceId,
      client_name: body.client.name,
      client_phone: body.client.phone,
      client_email: body.client.email,
      preferred_date: body.date,
      preferred_time: body.time,
      status: 'pending_confirmation',
      notes: 'Emergency booking submission - requires manual confirmation',
    };

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();

    if (error) {
      console.error('Booking error:', error);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 },
      );
    }

    // Send notification (WhatsApp integration)
    await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId,
        type: 'new_booking',
        appointment: appointment,
      }),
    });

    return NextResponse.json({
      success: true,
      appointmentId: appointment.id,
      message:
        'Booking request received. We will contact you within 2 hours to confirm.',
    });
  } catch (error) {
    console.error('Emergency booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
