import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { PaymentGatewayFactory, MultiGatewayProcessor } from '@/lib/payments/south-african-gateways';
import { aisensy } from '@/lib/aisensy';

export async function POST(request: NextRequest) {
  try {
    const { 
      tenantId, 
      items, 
      customerData, 
      paymentMethod = 'paystack',
      source = 'website' 
    } = await request.json();

    const supabase = createClient();

    // Calculate total
    const totalAmount = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        tenant_id: tenantId,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        total: totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    await supabase.from('order_items').insert(orderItems);

    // Initialize payment gateway
    const processor = new MultiGatewayProcessor();
    
    // Configure gateways
    if (process.env.PAYSTACK_SECRET_KEY) {
      const paystack = PaymentGatewayFactory.create('paystack', {
        secretKey: process.env.PAYSTACK_SECRET_KEY,
        testMode: process.env.NODE_ENV !== 'production'
      });
      processor.addGateway('paystack', paystack);
    }

    if (process.env.PAYFAST_MERCHANT_ID) {
      const payfast = PaymentGatewayFactory.create('payfast', {
        merchantId: process.env.PAYFAST_MERCHANT_ID,
        merchantKey: process.env.PAYFAST_MERCHANT_KEY,
        passphrase: process.env.PAYFAST_PASSPHRASE,
        testMode: process.env.NODE_ENV !== 'production'
      });
      processor.addGateway('payfast', payfast);
    }

    // Smart gateway selection
    const selectedGateway = processor.selectOptimalGateway(totalAmount, {
      isMobile: source === 'whatsapp' || source === 'mobile',
      location: 'ZA'
    });

    // Create payment
    const paymentParams = {
      amount: totalAmount,
      email: customerData.email,
      reference: `${tenantId}_${order.id}_${Date.now()}`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order=${order.id}`,
      metadata: {
        order_id: order.id,
        tenant_id: tenantId,
        customer_phone: customerData.phone,
        source
      }
    };

    let paymentResult;
    
    if (selectedGateway === 'paystack') {
      paymentResult = await processor.processPayment('paystack', {
        ...paymentParams,
        itemName: `InStyle Hair Boutique Order #${order.id}`,
        itemDescription: `${items.length} items from InStyle Hair Boutique`,
        merchantReference: paymentParams.reference,
        returnUrl: paymentParams.callback_url,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancelled`,
        notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/paystack`,
        customerEmail: customerData.email
      });
    } else if (selectedGateway === 'payfast') {
      paymentResult = await processor.processPayment('payfast', {
        ...paymentParams,
        itemName: `InStyle Hair Boutique Order #${order.id}`,
        itemDescription: `${items.length} items`,
        merchantReference: paymentParams.reference,
        returnUrl: paymentParams.callback_url,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancelled`,
        notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/payfast`,
        customerEmail: customerData.email
      });
    }

    // Track customer journey
    await supabase.from('customer_touchpoints').insert({
      tenant_id: tenantId,
      customer_phone: customerData.phone,
      touchpoint_type: 'checkout_initiated',
      source,
      metadata: {
        order_id: order.id,
        payment_method: selectedGateway,
        total_amount: totalAmount,
        items_count: items.length
      }
    });

    // Send WhatsApp confirmation if phone provided
    if (customerData.phone && source === 'whatsapp') {
      await aisensy.sendOrderConfirmation(customerData.phone, {
        orderNumber: order.id,
        totalAmount: `R${(totalAmount / 100).toFixed(2)}`,
        deliveryDate: 'Within 3-5 business days'
      });
    }

    // Update cart status if from cart
    if (customerData.cartId) {
      await supabase
        .from('carts')
        .update({ status: 'converted' })
        .eq('id', customerData.cartId);
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      payment_url: paymentResult?.authorization_url || paymentResult?.url,
      payment_method: selectedGateway,
      total_amount: totalAmount
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle checkout success
export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get('order');
    const reference = request.nextUrl.searchParams.get('reference');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const supabase = createClient();

    // Get order details
    const { data: order } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify payment if reference provided
    if (reference) {
      // This would verify with the payment gateway
      // For now, we'll mark as paid
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      // Track successful conversion
      await supabase.from('customer_touchpoints').insert({
        tenant_id: order.tenant_id,
        customer_phone: order.customer_phone,
        touchpoint_type: 'purchase_completed',
        source: 'checkout',
        metadata: {
          order_id: orderId,
          payment_reference: reference,
          total_amount: order.total
        }
      });

      // Trigger post-purchase automation
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/conversational-commerce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsell_flow',
          tenantId: order.tenant_id,
          orderId: order.id
        })
      });
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Order processed successfully'
    });

  } catch (error) {
    console.error('Checkout success error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}