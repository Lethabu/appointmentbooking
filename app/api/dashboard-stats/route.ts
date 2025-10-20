import { NextRequest, NextResponse } from 'next/server';
import { analytics } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.nextUrl.searchParams.get('tenantId');
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const stats = await analytics.getRealtimeStats();
    const topProducts = await analytics.getTopProducts();

    // Additional metrics
    const today = new Date().toISOString().split('T')[0];
    const { data: todayOrders } = await analytics.getSupabaseClient()
      .from('orders')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('created_at', today);

    const { data: abandonedCarts } = await analytics.getSupabaseClient()
      .from('carts')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'abandoned');

    const { data: socialClicks } = await analytics.getSupabaseClient()
      .from('customer_touchpoints')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('touchpoint_type', 'social_click')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    return NextResponse.json({
      ...stats,
      todayOrders: todayOrders?.length || 0,
      abandonedCarts: abandonedCarts?.length || 0,
      socialClicks: socialClicks?.length || 0,
      topProducts
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}