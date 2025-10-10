import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const signature = request.headers.get('x-paystack-signature');
  const body = await request.text();

  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const { event, data } = JSON.parse(body);

  if (event === 'charge.success') {
    const { reference, metadata } = data;
    const supabase = createClient();

    try {
      // Handle booking creation from metadata
      if (metadata.bookingDetails) {
        const { error: bookingError } = await supabase.from('bookings').insert([{
          ...metadata.bookingDetails,
          payment_reference: reference,
          status: 'confirmed',
          tenant_id: metadata.tenantId,
        }]);
        if (bookingError) throw new Error(`Webhook booking creation failed: ${bookingError.message}`);
      }

      // Handle product purchase from metadata
      if (metadata.items) {
        const { error: orderError } = await supabase.from('orders').insert([{
          items: metadata.items,
          total: metadata.total,
          customer_email: metadata.email,
          payment_reference: reference,
          status: 'paid',
          tenant_id: metadata.tenantId,
        }]);
        if (orderError) throw new Error(`Webhook order creation failed: ${orderError.message}`);
      }

    } catch (error) {
      console.error('Paystack webhook handler error:', error);
      // Even if processing fails, acknowledge receipt to Paystack to prevent retries
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return NextResponse.json({ success: false, error: errorMessage }, { status: 200 });
    }
  }

  return NextResponse.json({ received: true });
}