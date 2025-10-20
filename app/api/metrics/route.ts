import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In a real app, this data would be fetched from a database or analytics service
export async function GET() {
  const metrics = {
    sales: {
      total: 9850.75,
      average_per_day: 450.25,
      top_selling_product: 'Product A',
      whitelabel_revenue: {
        'instylehairboutique': 2500.50,
        'other_tenant': 1500.25
      }
    },
    performance: {
      api_latency_p95: '120ms',
      uptime: '99.98%',
      error_rate: '0.02%',
      database_health: 'ok'
    },
    ai: {
      chatbots_triggered: 1500,
      intents_recognized: 1350,
      fallback_rate: 0.1,
      top_intent: 'CheckBookingStatus'
    },
    social: {
      instagram_posts: 45,
      engagement_rate: '2.5%',
      top_post_id: 'ig_post_12345',
      mentions: 250
    }
  };

  return NextResponse.json(metrics);
}