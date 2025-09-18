import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { aisensy } from '@/lib/aisensy';

export async function POST(request: NextRequest) {
  try {
    const { action, tenantId } = await request.json();
    const supabase = createClient();

    switch (action) {
      case 'daily_sync':
        const [catalogSync, cartRecovery, reminders] = await Promise.all([
          syncCatalog(tenantId, supabase),
          processAbandonedCarts(tenantId, supabase),
          sendBookingReminders(tenantId, supabase)
        ]);

        return NextResponse.json({
          success: true,
          results: { catalogSync, cartRecovery, reminders }
        });

      case 'weekly_report':
        const stats = await generateWeeklyReport(tenantId, supabase);
        await sendWeeklyReport(tenantId, stats);
        return NextResponse.json({ success: true, stats });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Automation error:', error);
    return NextResponse.json({ error: 'Automation failed' }, { status: 500 });
  }
}

async function syncCatalog(tenantId: string, supabase: any) {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_active', true);

  const catalogItems = products?.map((p: any) => ({
    retailer_id: p.sku || p.id,
    name: p.name,
    price: (p.price / 100).toString(),
    currency: 'ZAR',
    image_url: p.image_urls?.[0] || ''
  })) || [];

  await aisensy.syncCatalog(catalogItems);
  return { synced: catalogItems.length };
}

async function processAbandonedCarts(tenantId: string, supabase: any) {
  const { data: carts } = await supabase
    .from('carts')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .lt('created_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString());

  let processed = 0;
  for (const cart of carts || []) {
    await supabase
      .from('carts')
      .update({ status: 'abandoned' })
      .eq('id', cart.id);

    const topItem = cart.items[0];
    await aisensy.sendAbandonedCartReminder(cart.customer_phone, {
      productName: topItem.name,
      totalAmount: `R${(cart.total_amount / 100).toFixed(2)}`,
      cartUrl: `https://instylehairboutique.co.za/cart/${cart.id}`
    });
    processed++;
  }

  return { processed };
}

async function sendBookingReminders(tenantId: string, supabase: any) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, profiles(*)')
    .eq('tenant_id', tenantId)
    .gte('start_time', tomorrow.toISOString().split('T')[0])
    .lt('start_time', new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  let sent = 0;
  for (const apt of appointments || []) {
    if (apt.profiles?.phone) {
      await aisensy.sendBookingConfirmation(apt.profiles.phone, {
        service: 'Hair Service',
        date: new Date(apt.start_time).toLocaleDateString(),
        time: new Date(apt.start_time).toLocaleTimeString(),
        price: 'R450'
      });
      sent++;
    }
  }

  return { sent };
}

async function generateWeeklyReport(tenantId: string, supabase: any) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [orders, bookings, sessions] = await Promise.all([
    supabase.from('orders').select('total').eq('tenant_id', tenantId).gte('created_at', weekAgo.toISOString()),
    supabase.from('appointments').select('*').eq('tenant_id', tenantId).gte('created_at', weekAgo.toISOString()),
    supabase.from('chat_sessions').select('*').eq('tenant_id', tenantId).gte('created_at', weekAgo.toISOString())
  ]);

  return {
    revenue: orders.data?.reduce((sum: number, o: any) => sum + o.total, 0) || 0,
    orders: orders.data?.length || 0,
    bookings: bookings.data?.length || 0,
    whatsapp_sessions: sessions.data?.length || 0
  };
}

async function sendWeeklyReport(tenantId: string, stats: any) {
  const message = `📊 Weekly Report:\n💰 Revenue: R${(stats.revenue / 100).toFixed(2)}\n📦 Orders: ${stats.orders}\n📅 Bookings: ${stats.bookings}\n💬 WhatsApp: ${stats.whatsapp_sessions}`;
  await aisensy.sendMessage('+27123456789', message);
}