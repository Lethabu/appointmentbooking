import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hostname = searchParams.get('hostname');

  if (!hostname) {
    return NextResponse.json(
      { error: 'Hostname is required' },
      { status: 400 },
    );
  }

  try {
    // Use Supabase instead of Redis for tenant lookup
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('id')
      .eq('domain', hostname)
      .single();

    if (error || !tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({ tenantId: tenant.id });
  } catch (error) {
    console.error('Error resolving tenant:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
