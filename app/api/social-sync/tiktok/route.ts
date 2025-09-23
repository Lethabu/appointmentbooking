import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { tenantId, action } = await request.json();
    const supabase = createClient();

    switch (action) {
      case 'sync_products':
        // Get active products
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('salon_id', tenantId)
          .eq('is_active', true);

        // Transform for TikTok Shop format
        const tiktokProducts = products?.map((product) => ({
          title: product.name,
          description: product.description || '',
          price: (product.price / 100).toFixed(2),
          currency: 'ZAR',
          images: product.image_urls || [],
          category: 'Beauty & Personal Care',
          brand: 'InStyle Hair Boutique',
          sku: product.id,
          inventory: product.stock_quantity,
          tags: ['hair', 'beauty', 'southafrica', 'instyle'],
        }));

        // In production, call TikTok Shop API
        // For now, simulate sync
        const syncResult = {
          success: true,
          products_synced: tiktokProducts?.length || 0,
          shop_url: 'https://www.tiktok.com/@instylehairboutique/shop',
        };

        // Update products with TikTok IDs
        for (const product of products || []) {
          await supabase
            .from('products')
            .update({
              tiktok_product_id: `tiktok_${product.id}`,
              social_media_urls: {
                tiktok_shop: `${syncResult.shop_url}/${product.id}`,
              },
            })
            .eq('id', product.id);
        }

        return NextResponse.json(syncResult);

      case 'generate_content':
        const { product_ids } = await request.json();

        const { data: contentProducts } = await supabase
          .from('products')
          .select('*')
          .in('id', product_ids);

        // Generate TikTok content suggestions
        const contentSuggestions = contentProducts?.map((product) => ({
          product_name: product.name,
          video_concepts: [
            `Before & after transformation using ${product.name}`,
            `Quick styling tutorial with ${product.name}`,
            `Customer reaction to ${product.name} results`,
          ],
          hashtags: [
            '#InstyleHairBoutique',
            '#HairGoals',
            '#SouthAfricanHair',
            '#HairTok',
          ],
          music_suggestions: ['trending_beauty_audio', 'upbeat_transformation'],
          cta: `Shop ${product.name} - Link in bio! 💫`,
        }));

        return NextResponse.json({ content_suggestions: contentSuggestions });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('TikTok sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
