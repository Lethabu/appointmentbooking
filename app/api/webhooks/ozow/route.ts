import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { aisensy } from '@/lib/aisensy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.Status === 'Complete') {
      const reference = body.TransactionReference;
      const appointmentId = reference.split('-')[0];

      const supabase = createServerSupabaseClient();

      const { data: appointment } = await supabase
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

      if (appointment?.customer.phone) {
        await aisensy.sendMessage(
          appointment.customer.phone,
          `✅ EFT Payment received! Your ${appointment.service.name} appointment is confirmed for ${new Date(appointment.datetime).toLocaleDateString('en-ZA')}. Thank you!`,
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Ozow webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}
