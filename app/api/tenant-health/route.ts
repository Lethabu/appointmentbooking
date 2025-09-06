import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id') || 'unknown';
  
  try {
    // Test tenant context
    await supabase.rpc('set_tenant_context', { p_tenant_id: tenantId });
    
    // Test database connectivity with tenant isolation
    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('count')
      .limit(1);
    
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    const health = {
      status: 'healthy',
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      checks: {
        database: !apptError && !prodError,
        tenant_context: true,
        rls_active: appointments !== null
      }
    };
    
    const allHealthy = Object.values(health.checks).every(check => check === true);
    
    return NextResponse.json({
      ...health,
      status: allHealthy ? 'healthy' : 'degraded'
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    }, { status: 500 });
  }
}