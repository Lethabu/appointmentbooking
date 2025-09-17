export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSessionAndSalon } from '@/app/lib/api-helpers';

export async function GET() {
  try {
    const { salon, supabase, authError } = await getSessionAndSalon();
    if (authError) return authError;

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, description, price, stock_quantity, image_urls')
      .eq('salon_id', salon.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(products);
  } catch (e) {
    console.error('Unhandled error in GET /api/dashboard/products:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
