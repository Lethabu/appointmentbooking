import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { aisensy } from '@/lib/aisensy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, variables, answers } = body;

    const supabase = createServerSupabaseClient();
    const {
      customerName,
      customerPhone,
      service,
      date,
      tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
    } = variables;

    if (service && date && customerName) {
      const { data: serviceData } = await supabase
        .from('services')
        .select('*')
        .eq('name', service)
        .eq('tenant_id', tenantId)
        .single();

      if (serviceData) {
        const { data: customer } = await supabase
          .from('customers')
          .upsert({
            tenant_id: tenantId,
            name: customerName,
            phone: customerPhone,
            consent_data_processing: true,
          })
          .select()
          .single();

        const { data: appointment } = await supabase
          .from('appointments')
          .insert({
            tenant_id: tenantId,
            service_id: serviceData.id,
            customer_id: customer.id,
            datetime: date,
            price: serviceData.price,
            status: 'pending',
          })
          .select()
          .single();

        await aisensy.sendMessage(
          customerPhone,
          `🎉 Booking confirmed!\n\nService: ${service}\nDate: ${new Date(date).toLocaleDateString('en-ZA')}\nPrice: R${(serviceData.price / 100).toFixed(2)}\n\nSee you soon! - InStyle Hair Boutique`,
        );

        return NextResponse.json({
          success: true,
          appointmentId: appointment.id,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Typebot webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}
