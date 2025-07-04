import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const salonIdentifier = searchParams.get('salon');

  if (!salonIdentifier) {
    return NextResponse.json({ error: 'A salon identifier is required' }, { status: 400 });
  }

  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
        },
      }
    )

    // Find the salon by its subdomain or custom domain
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id, name, logo_url')
      .or(`subdomain.eq.${salonIdentifier},custom_domain.eq.${salonIdentifier}`)
      .single();

    if (salonError || !salon) {
      return NextResponse.json({ error: 'Salon not found' }, { status: 404 });
    }

    // Fetch the active, in-stock products for that salon
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, description, price, image_urls, stock_quantity, is_active')
      .eq('salon_id', salon.id)
      .eq('is_active', true)
      .gt('stock_quantity', 0)
      .order('name', { ascending: true });

    if (productsError) {
      console.error('Products query error:', productsError);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // Return both salon details and its products
    return NextResponse.json({ salon, products: products || [] });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}