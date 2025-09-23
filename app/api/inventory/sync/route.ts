import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, operation } = await request.json();

    const inventoryUpdate = {
      productId,
      previousQuantity: 10,
      newQuantity: operation === 'decrease' ? 10 - quantity : 10 + quantity,
      operation,
      timestamp: new Date().toISOString(),
    };

    if (inventoryUpdate.newQuantity <= 2) {
      await fetch('/api/webhooks/social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'instagram',
          caption: `⚡ Only ${inventoryUpdate.newQuantity} left! Get yours now at instylehairboutique.co.za/shop`,
          tenantId: 'instylehairboutique',
        }),
      });
    }

    return NextResponse.json({
      success: true,
      inventory: inventoryUpdate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Inventory sync failed' },
      { status: 500 },
    );
  }
}
