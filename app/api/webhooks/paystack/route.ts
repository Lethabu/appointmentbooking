<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

=======
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { typebotOrchestrator } from '@/lib/typebot-orchestrator'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')
    
>>>>>>> origin/feat/instyle-whitelabel
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
<<<<<<< HEAD
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = createClient();

    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      const orderId = metadata.order_id;

      // Update order status
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      // Update product stock
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId);

      for (const item of orderItems || []) {
        await supabase.rpc('decrement_stock', {
          product_id: item.product_id,
          quantity: item.quantity,
        });
      }

      // Send WhatsApp confirmation (if enabled)
      if (metadata.customer_phone) {
        await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: metadata.customer_phone,
            message: `Order confirmed! Reference: ${reference}. We'll prepare your items for collection.`,
          }),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
=======
      .digest('hex')
    
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    
    if (event.event === 'charge.success') {
      const reference = event.data.reference
      const appointmentId = reference.replace('apt_', '')
      
      const supabase = createServerSupabaseClient()
      
      // Update appointment status
      const { data: appointment, error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId)
        .select(`
          *,
          customer:customers(*),
          service:services(*),
          tenant:tenants(*)
        `)
        .single()

      if (error) {
        console.error('Error updating appointment:', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }

      // Trigger Typebot confirmation flow with AiSensy WhatsApp
      if (appointment) {
        await typebotOrchestrator.triggerBookingFlow({
          customerName: appointment.customer.name,
          customerPhone: appointment.customer.phone,
          serviceName: appointment.service.name,
          tenantId: appointment.tenant_id,
          appointmentId: appointment.id
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
>>>>>>> origin/feat/instyle-whitelabel
