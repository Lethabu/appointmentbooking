import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { aisensy } from '@/lib/aisensy';

export async function POST(request: NextRequest) {
  try {
    const { tenantId, action } = await request.json();
    const supabase = createClient();

    if (action === 'sync') {
      // Fetch products for tenant
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true);

      if (error) throw error;

      // Format products for WhatsApp catalog
      const catalogItems = products.map(product => ({
        retailer_id: product.sku || product.id,
        name: product.name,
        description: product.description || '',
        price: (product.price / 100).toString(),
        currency: 'ZAR',
        image_url: product.image_urls?.[0] || '',
        category: product.category || 'General'
      }));

      // Sync with AiSensy
      const syncResult = await aisensy.syncCatalog(catalogItems);

      // Update catalog record
      await supabase
        .from('whatsapp_catalogs')
        .upsert({
          tenant_id: tenantId,
          catalog_id: syncResult.catalog_id,
          name: 'InStyle Hair Boutique Catalog',
          product_count: catalogItems.length,
          last_synced_at: new Date().toISOString()
        });

      return NextResponse.json({ 
        success: true, 
        catalog_id: syncResult.catalog_id,
        products_synced: catalogItems.length 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('WhatsApp catalog error:', error);
    return NextResponse.json({ error: 'Catalog sync failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.nextUrl.searchParams.get('tenantId');
    const supabase = createClient();

    const { data: catalog, error } = await supabase
      .from('whatsapp_catalogs')
      .select('*')
      .eq('tenant_id', tenantId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json(catalog || { status: 'not_synced' });
  } catch (error) {
    console.error('Get catalog error:', error);
    return NextResponse.json({ error: 'Failed to get catalog' }, { status: 500 });
  }
}