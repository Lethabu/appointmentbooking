import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { PayFastGateway } from '@/lib/payments/south-african-gateways';
import { aisensy } from '@/lib/aisensy';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData.entries());
    
    const payfast = new PayFastGateway({
      merchantId: process.env.PAYFAST_MERCHANT_ID!,
      merchantKey: process.env.PAYFAST_MERCHANT_KEY!,
      passphrase: process.env.PAYFAST_PASSPHRASE!
    });

    if (!payfast.verifySignature(payload as Record<string, string>)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient();
    const orderId = payload.m_payment_id as string;

    if (payload.payment_status === 'COMPLETE') {
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (order?.customer_phone) {
        await aisensy.sendOrderConfirmation(order.customer_phone, {
          orderNumber: orderId,
          totalAmount: `R${(order.total / 100).toFixed(2)}`,
          deliveryDate: '3-5 business days'
        });
      }
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error('PayFast webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}