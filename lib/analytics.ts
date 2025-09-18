import { createClient } from '@/lib/supabase';

export class InstyleAnalytics {
  private supabase = createClient();
  private tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

  async getRealtimeStats() {
    const [revenue, orders, bookings, sessions] = await Promise.all([
      this.getTotalRevenue(),
      this.getOrderCount(),
      this.getBookingCount(),
      this.getWhatsAppSessions()
    ]);

    return {
      totalRevenue: revenue,
      totalOrders: orders,
      totalBookings: bookings,
      whatsappSessions: sessions,
      conversionRate: this.calculateConversionRate(orders, sessions),
      avgOrderValue: orders > 0 ? revenue / orders : 0
    };
  }

  private async getTotalRevenue() {
    const { data } = await this.supabase
      .from('orders')
      .select('total')
      .eq('tenant_id', this.tenantId)
      .eq('status', 'paid');
    
    return data?.reduce((sum, order) => sum + order.total, 0) || 0;
  }

  private async getOrderCount() {
    const { count } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', this.tenantId);
    
    return count || 0;
  }

  private async getBookingCount() {
    const { count } = await this.supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', this.tenantId);
    
    return count || 0;
  }

  private async getWhatsAppSessions() {
    const { count } = await this.supabase
      .from('chat_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', this.tenantId)
      .eq('platform', 'whatsapp');
    
    return count || 0;
  }

  private calculateConversionRate(orders: number, sessions: number): number {
    return sessions > 0 ? (orders / sessions) * 100 : 0;
  }

  async trackEvent(eventType: string, data: any) {
    await this.supabase.from('customer_touchpoints').insert({
      tenant_id: this.tenantId,
      customer_phone: data.phone || 'anonymous',
      touchpoint_type: eventType,
      source: data.source || 'website',
      metadata: data
    });
  }

  async getTopProducts(limit = 5) {
    const { data } = await this.supabase
      .from('order_items')
      .select('product_id, products(name), quantity')
      .eq('products.tenant_id', this.tenantId)
      .limit(limit);

    const productSales = data?.reduce((acc, item) => {
      const productId = item.product_id;
      if (!acc[productId]) {
        acc[productId] = { name: item.products?.name, quantity: 0 };
      }
      acc[productId].quantity += item.quantity;
      return acc;
    }, {});

    return Object.entries(productSales || {})
      .sort(([,a], [,b]) => (b as any).quantity - (a as any).quantity)
      .slice(0, limit);
  }

  async getCustomerJourney(customerPhone: string) {
    const { data } = await this.supabase
      .from('customer_touchpoints')
      .select('*')
      .eq('tenant_id', this.tenantId)
      .eq('customer_phone', customerPhone)
      .order('created_at', { ascending: true });

    return data || [];
  }
}

export const analytics = new InstyleAnalytics();