import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { typebotOrchestrator } from '@/lib/typebot-orchestrator';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const appointmentId = reference.replace('apt_', '');

      const supabase = createServerSupabaseClient();

      // Update appointment status
      const { data: appointment, error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId)
        .select(
          `
          *,
          customer:customers(*),
          service:services(*),
          tenant:tenants(*)
        `,
        )
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      // Trigger Typebot confirmation flow with AiSensy WhatsApp
      if (appointment) {
        await typebotOrchestrator.triggerBookingFlow({
          customerName: appointment.customer.name,
          customerPhone: appointment.customer.phone,
          serviceName: appointment.service.name,
          tenantId: appointment.tenant_id,
          appointmentId: appointment.id,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}
