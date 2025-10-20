import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');

  if (!tenantId) {
    return NextResponse.json({ error: 'x-tenant-id header is required' }, { status: 400 });
  }

  try {
    const supabase = createClient();
    // Use an RPC call to test if the tenant context can be set in the database
    const { error } = await supabase.rpc('set_tenant_context', { p_tenant_id: tenantId });

    if (error) {
      throw new Error(`Tenant context check failed: ${error.message}`);
    }

    return NextResponse.json({ status: 'ok', tenantId: tenantId });

  } catch (error) {
    console.error(`Tenant health check failed for [${tenantId}]:`, error);
    return NextResponse.json(
      { status: 'error', tenantId: tenantId, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
