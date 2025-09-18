import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { action, tenantId, platform, data } = await request.json();
    const supabase = createClient();

    switch (action) {
      case 'sync_meta_commerce':
        // Sync products to Facebook/Instagram Shop
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('is_active', true);

        const metaProducts = products?.map(product => ({
          retailer_id: product.sku || product.id,
          name: product.name,
          description: product.description || '',
          price: (product.price / 100) * 100, // Convert to cents for Meta
          currency: 'ZAR',
          availability: product.stock_quantity > 0 ? 'in stock' : 'out of stock',
          condition: 'new',
          brand: 'InStyle Hair Boutique',
          category: product.category || 'Beauty & Personal Care > Hair Care',
          image_link: product.image_urls?.[0] || '',
          link: `https://instylehairboutique.co.za/shop/${product.id}`,
          mobile_link: `https://instylehairboutique.co.za/shop/${product.id}`,
          google_product_category: 'Health & Beauty > Personal Care > Cosmetics > Hair Care'
        }));

        // In production, this would call Meta Commerce API
        // For now, we'll simulate the sync
        const syncResult = {
          success: true,
          products_synced: metaProducts?.length || 0,
          catalog_id: `meta_catalog_${tenantId}`,
          shop_url: `https://www.facebook.com/commerce/products/?referral_code=${tenantId}`
        };

        // Update products with Meta commerce IDs
        for (const product of products || []) {
          await supabase
            .from('products')
            .update({
              meta_commerce_id: `meta_${product.id}`,
              social_media_urls: {
                facebook_shop: `${syncResult.shop_url}/${product.id}`,
                instagram_shop: `https://www.instagram.com/instyle_hair_boutique_/shop/${product.id}`
              }
            })
            .eq('id', product.id);
        }

        return NextResponse.json(syncResult);

      case 'track_social_click':
        // Track clicks from social media
        const { source, product_id, customer_data } = data;
        
        await supabase.from('customer_touchpoints').insert({
          tenant_id: tenantId,
          customer_phone: customer_data?.phone || 'unknown',
          touchpoint_type: 'social_click',
          source: source, // 'instagram', 'tiktok', 'facebook'
          metadata: {
            product_id,
            referrer: customer_data?.referrer,
            utm_source: customer_data?.utm_source
          }
        });

        return NextResponse.json({ success: true });

      case 'create_instagram_story':
        // Create Instagram story with product tags
        const { product_ids, story_template } = data;
        
        const { data: storyProducts } = await supabase
          .from('products')
          .select('*')
          .in('id', product_ids);

        // In production, this would use Instagram Basic Display API
        const storyData = {
          template: story_template,
          products: storyProducts?.map(p => ({
            id: p.id,
            name: p.name,
            price: `R${(p.price / 100).toFixed(2)}`,
            image: p.image_urls?.[0]
          })),
          cta_url: `https://instylehairboutique.co.za/shop`,
          hashtags: ['#InstyleHairBoutique', '#HairGoals', '#SouthAfricanHair']
        };

        // Log the social post
        await supabase.from('social_posts').insert({
          tenant_id: tenantId,
          platform: 'instagram',
          post_id: `story_${Date.now()}`,
          post_url: `https://www.instagram.com/stories/instyle_hair_boutique_/`,
          product_tags: product_ids,
          engagement_metrics: { views: 0, clicks: 0, shares: 0 }
        });

        return NextResponse.json({ success: true, story_data: storyData });

      case 'tiktok_product_showcase':
        // Create TikTok product showcase
        const { featured_products, video_concept } = data;
        
        const { data: tiktokProducts } = await supabase
          .from('products')
          .select('*')
          .in('id', featured_products);

        const tiktokShowcase = {
          concept: video_concept,
          products: tiktokProducts?.map(p => ({
            name: p.name,
            price: `R${(p.price / 100).toFixed(2)}`,
            category: p.category,
            shop_link: `https://instylehairboutique.co.za/shop/${p.id}`
          })),
          hashtags: ['#InstyleHairBoutique', '#HairTok', '#SouthAfricanBeauty', '#HairInstallation'],
          music_suggestion: 'trending_beauty_audio',
          cta: 'Link in bio to shop! 💫'
        };

        await supabase.from('social_posts').insert({
          tenant_id: tenantId,
          platform: 'tiktok',
          post_id: `tiktok_${Date.now()}`,
          post_url: `https://www.tiktok.com/@instylehairboutique`,
          product_tags: featured_products,
          engagement_metrics: { views: 0, likes: 0, shares: 0, comments: 0 }
        });

        return NextResponse.json({ success: true, showcase_data: tiktokShowcase });

      case 'get_social_analytics':
        // Get social media performance analytics
        const { data: socialPosts } = await supabase
          .from('social_posts')
          .select('*')
          .eq('tenant_id', tenantId)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        const analytics = {
          total_posts: socialPosts?.length || 0,
          platforms: {
            instagram: socialPosts?.filter(p => p.platform === 'instagram').length || 0,
            tiktok: socialPosts?.filter(p => p.platform === 'tiktok').length || 0,
            facebook: socialPosts?.filter(p => p.platform === 'facebook').length || 0
          },
          engagement: {
            total_views: socialPosts?.reduce((sum, p) => sum + (p.engagement_metrics?.views || 0), 0) || 0,
            total_clicks: socialPosts?.reduce((sum, p) => sum + (p.engagement_metrics?.clicks || 0), 0) || 0,
            total_shares: socialPosts?.reduce((sum, p) => sum + (p.engagement_metrics?.shares || 0), 0) || 0
          }
        };

        return NextResponse.json(analytics);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Social commerce error:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}