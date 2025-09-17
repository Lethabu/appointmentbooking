import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, setTenantContext } from '@/lib/supabase';
import { createPaystackPayment } from '@/lib/payments/south-african-gateways';
import { typebotOrchestrator } from '@/lib/typebot-orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      datetime,
      paymentMethod = 'paystack',
    } = body;

    const supabase = createServerSupabaseClient();
    await setTenantContext(tenantId);

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Create or get customer
    let { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerEmail)
      .eq('tenant_id', tenantId)
      .single();

    if (!customer) {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          tenant_id: tenantId,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          consent_data_processing: true,
          consent_marketing: false,
        })
        .select()
        .single();

      if (customerError) {
        return NextResponse.json(
          { error: 'Failed to create customer' },
          { status: 500 },
        );
      }
      customer = newCustomer;
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        tenant_id: tenantId,
        service_id: serviceId,
        customer_id: customer.id,
        datetime: datetime,
        price: service.price,
        status: 'pending',
      })
      .select()
      .single();

    if (appointmentError) {
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 },
      );
    }

    // Create payment
    const paymentData = {
      amount: service.price,
      email: customerEmail,
      reference: `apt_${appointment.id}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking-success?ref=${appointment.id}`,
    };

    const paymentResponse = await createPaystackPayment(paymentData);

    if (paymentResponse.status) {
      // Trigger Typebot booking confirmation flow
      await typebotOrchestrator.triggerBookingFlow({
        customerName,
        customerPhone,
        serviceName: service.name,
        tenantId,
        appointmentId: appointment.id,
      });

      return NextResponse.json({
        success: true,
        appointmentId: appointment.id,
        paymentUrl: paymentResponse.data.authorization_url,
        reference: paymentResponse.data.reference,
      });
    }

    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 },
    );
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
