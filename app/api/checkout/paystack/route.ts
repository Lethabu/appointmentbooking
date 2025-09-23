import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { cartItems, customerData, tenantId } = await request.json();
    const supabase = createClient();

    // Calculate total
    const total = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity * 100,
      0,
    ); // Convert to cents

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        salon_id: tenantId,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price * 100, // Convert to cents
    }));

    await supabase.from('order_items').insert(orderItems);

    // Initialize Paystack payment
    const paystackResponse = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerData.email,
          amount: total,
          currency: 'ZAR',
          reference: `order_${order.id}_${Date.now()}`,
          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?order_id=${order.id}`,
          metadata: {
            order_id: order.id,
            tenant_id: tenantId,
            customer_phone: customerData.phone,
          },
        }),
      },
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error('Paystack initialization failed');
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
