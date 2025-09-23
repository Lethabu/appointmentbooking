import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.nextUrl.searchParams.get('tenantId');
    const supabase = createClient();

    // Get sales data
    const { data: orders } = await supabase
      .from('orders')
      .select('total, status, created_at')
      .eq('salon_id', tenantId)
      .gte(
        'created_at',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      );

    // Get product performance
    const { data: products } = await supabase
      .from('products')
      .select('name, sales_count, stock_quantity')
      .eq('salon_id', tenantId)
      .order('sales_count', { ascending: false })
      .limit(5);

    const analytics = {
      revenue: {
        total:
          orders
            ?.filter((o) => o.status === 'paid')
            .reduce((sum, o) => sum + o.total, 0) || 0,
        orders_count: orders?.filter((o) => o.status === 'paid').length || 0,
        pending: orders?.filter((o) => o.status === 'pending').length || 0,
      },
      top_products:
        products?.map((p) => ({
          name: p.name,
          sales: p.sales_count,
          stock: p.stock_quantity,
        })) || [],
      conversion_rate: orders?.length
        ? (
            (orders.filter((o) => o.status === 'paid').length / orders.length) *
            100
          ).toFixed(1)
        : '0',
    };

    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json({ error: 'Analytics failed' }, { status: 500 });
  }
}
