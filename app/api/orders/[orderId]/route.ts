import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest, context: any) {
  try {
    const { orderId } = context.params;
    const supabase = createClient();

    const { data: order, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          quantity,
          price,
          products (name, image_urls)
        )
      `,
      )
      .eq('id', orderId)
      .single();

    if (error) throw error;

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
}
