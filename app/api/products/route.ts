import { NextRequest, NextResponse } from 'next/server';
import { createTenantClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id') || 'default';

  try {
    // Use Strapi if configured, fallback to Supabase
    if (process.env.STRAPI_URL) {
      const response = await fetch(
        `${process.env.STRAPI_URL}/api/products?filters[tenant_id][$eq]=${tenantId}`,
      );
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Fallback to tenant-aware Supabase
    const supabase = createTenantClient(tenantId);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId);

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}
