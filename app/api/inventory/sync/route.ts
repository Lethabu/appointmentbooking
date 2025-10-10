import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Placeholder for Instagram API interaction
async function postToInstagram(tenantId: string, message: string) {
  console.log(`[${tenantId}] Posting to Instagram: ${message}`);
  // Mock success response
  return { success: true, postId: `ig_mock_${Date.now()}` };
}

export async function POST(request: NextRequest) {
  try {
    const { productId, newStock, tenantId } = await request.json();

    if (productId === undefined || newStock === undefined || !tenantId) {
      return NextResponse.json({ error: 'ProductId, newStock, and tenantId are required.' }, { status: 400 });
    }

    const supabase = createClient();

    const inventoryUpdate = {
      stock_level: newStock,
      last_updated: new Date().toISOString(),
    };

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(inventoryUpdate)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Supabase inventory update error:', error);
      throw new Error('Failed to sync inventory.');
    }

    // Check for low stock and notify for specific tenant
    if (tenantId === 'instylehairboutique' && newStock < 5) {
      const message = `LOW STOCK ALERT! 🚨 Only ${newStock} units of ${updatedProduct.name} left. Get yours now! #instylehairboutique #limitedstock`;
      await postToInstagram(tenantId, message);
    }

    return NextResponse.json({ success: true, product: updatedProduct });

  } catch (error) {
    console.error('Inventory Sync API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: 'Failed to sync inventory', details: errorMessage }, { status: 500 });
  }
}