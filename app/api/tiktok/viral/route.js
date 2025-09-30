import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { video_id, views, tenant_id } = await request.json();

    // Viral threshold: 10k views
    if (views >= 10000) {
      // Auto-create priority booking slot
      const prioritySlot = {
        tenant_id: tenant_id || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
        slot_type: 'viral_priority',
        discount: 20, // 20% viral discount
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h expiry
      };

      // Send viral alert to tenant
      console.log(
        `🔥 VIRAL ALERT: Video ${video_id} hit ${views} views! Priority slot created.`,
      );

      return NextResponse.json({
        success: true,
        viral_triggered: true,
        priority_slot: prioritySlot,
        message: `🔥 Your video went viral! ${views} views earned you a 20% discount and priority booking!`,
      });
    }

    return NextResponse.json({
      success: true,
      viral_triggered: false,
      current_views: views,
      views_needed: 10000 - views,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
