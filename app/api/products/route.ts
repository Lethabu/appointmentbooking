import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Placeholder for auth middleware
async function requireAuth(req: NextRequest) {
  // In a real app, this would validate a JWT or session
  console.log('Auth check passed (placeholder)');
  return { user: { id: 'user_123', role: 'customer' } };
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, products: data });

  } catch (error) {
    console.error('Get Products API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: 'Failed to fetch products', details: errorMessage }, { status: 500 });
  }
}