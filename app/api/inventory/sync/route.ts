import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, operation } = await request.json();
<<<<<<< HEAD

=======
    
>>>>>>> origin/feat/instyle-whitelabel
    const inventoryUpdate = {
      productId,
      previousQuantity: 10,
      newQuantity: operation === 'decrease' ? 10 - quantity : 10 + quantity,
      operation,
<<<<<<< HEAD
      timestamp: new Date().toISOString(),
=======
      timestamp: new Date().toISOString()
>>>>>>> origin/feat/instyle-whitelabel
    };

    if (inventoryUpdate.newQuantity <= 2) {
      await fetch('/api/webhooks/social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'instagram',
          caption: `⚡ Only ${inventoryUpdate.newQuantity} left! Get yours now at instylehairboutique.co.za/shop`,
<<<<<<< HEAD
          tenantId: 'instylehairboutique',
        }),
      });
    }

    return NextResponse.json({
      success: true,
      inventory: inventoryUpdate,
=======
          tenantId: 'instylehairboutique'
        })
      });
    }

    return NextResponse.json({ 
      success: true, 
      inventory: inventoryUpdate 
>>>>>>> origin/feat/instyle-whitelabel
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Inventory sync failed' },
<<<<<<< HEAD
      { status: 500 },
    );
  }
}
=======
      { status: 500 }
    );
  }
}
>>>>>>> origin/feat/instyle-whitelabel
