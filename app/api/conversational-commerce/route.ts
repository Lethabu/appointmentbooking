import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { aisensy } from '@/lib/aisensy';

export async function POST(request: NextRequest) {
  try {
    const { action, tenantId, customerPhone, message, platform = 'whatsapp' } = await request.json();
    const supabase = createClient();

    switch (action) {
      case 'start_session':
        // Create or update chat session
        const { data: session } = await supabase
          .from('chat_sessions')
          .upsert({
            tenant_id: tenantId,
            customer_phone: customerPhone,
            platform,
            status: 'active',
            last_activity_at: new Date().toISOString()
          })
          .select()
          .single();

        // Track touchpoint
        await supabase.from('customer_touchpoints').insert({
          tenant_id: tenantId,
          customer_phone: customerPhone,
          touchpoint_type: 'whatsapp_message',
          source: platform,
          metadata: { message_type: 'session_start' }
        });

        return NextResponse.json({ session_id: session.id });

      case 'add_to_cart':
        const { productId, quantity = 1 } = await request.json();
        
        // Get product details
        const { data: product } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (!product) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Get or create cart
        let { data: cart } = await supabase
          .from('carts')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('customer_phone', customerPhone)
          .eq('status', 'active')
          .single();

        const cartItem = {
          product_id: productId,
          name: product.name,
          price: product.price,
          quantity,
          total: product.price * quantity
        };

        if (!cart) {
          // Create new cart
          const { data: newCart } = await supabase
            .from('carts')
            .insert({
              tenant_id: tenantId,
              customer_phone: customerPhone,
              items: [cartItem],
              total_amount: cartItem.total
            })
            .select()
            .single();
          cart = newCart;
        } else {
          // Update existing cart
          const existingItems = cart.items || [];
          const existingItemIndex = existingItems.findIndex((item: any) => item.product_id === productId);
          
          if (existingItemIndex >= 0) {
            existingItems[existingItemIndex].quantity += quantity;
            existingItems[existingItemIndex].total = existingItems[existingItemIndex].price * existingItems[existingItemIndex].quantity;
          } else {
            existingItems.push(cartItem);
          }

          const totalAmount = existingItems.reduce((sum: number, item: any) => sum + item.total, 0);

          await supabase
            .from('carts')
            .update({
              items: existingItems,
              total_amount: totalAmount
            })
            .eq('id', cart.id);
        }

        // Send WhatsApp confirmation
        await aisensy.sendTemplate(customerPhone, 'cart_updated', [
          product.name,
          `R${(product.price / 100).toFixed(2)}`
        ]);

        return NextResponse.json({ success: true, cart_id: cart.id });

      case 'abandoned_cart_recovery':
        // Find abandoned carts
        const { data: abandonedCarts } = await supabase
          .from('carts')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('status', 'active')
          .lt('created_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()); // 2 hours ago

        for (const cart of abandonedCarts || []) {
          // Mark as abandoned
          await supabase
            .from('carts')
            .update({ 
              status: 'abandoned',
              abandoned_at: new Date().toISOString()
            })
            .eq('id', cart.id);

          // Send recovery message
          const topItem = cart.items[0];
          await aisensy.sendTemplate(cart.customer_phone, 'abandoned_cart_recovery', [
            topItem.name,
            `R${(cart.total_amount / 100).toFixed(2)}`
          ]);
        }

        return NextResponse.json({ 
          success: true, 
          abandoned_carts_processed: abandonedCarts?.length || 0 
        });

      case 'upsell_flow':
        const { orderId } = await request.json();
        
        // Get order details
        const { data: order } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', orderId)
          .single();

        if (!order) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Determine upsell products based on purchase
        const hasWig = order.order_items.some((item: any) => 
          item.product_id && item.product_id.includes('wig')
        );

        if (hasWig) {
          // Suggest care products
          await aisensy.sendTemplate(order.customer_phone, 'wig_care_upsell', [
            order.customer_name || 'Valued Customer'
          ]);
        }

        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Conversational commerce error:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}