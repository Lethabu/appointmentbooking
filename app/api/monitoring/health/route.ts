import { NextRequest, NextResponse } from 'next/server';
import { EmergencyTenantResolver } from '@/lib/emergency-tenant-resolver'; // Assuming this is the correct path
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const checks = [];

  try {
    // Database connectivity
    const dbStart = Date.now();
    // Use a more specific check, like selecting from a known table
    await supabase.from('salons').select('id', { count: 'exact', head: true });
    checks.push({
      name: 'database',
      status: 'healthy',
      duration: Date.now() - dbStart
    });

    // Tenant resolution
    const tenantStart = Date.now();
    const hostname = request.headers.get('host') || '';
    const tenant = await EmergencyTenantResolver.resolveTenant(hostname);
    checks.push({
      name: 'tenant_resolution',
      status: tenant ? 'healthy' : 'degraded',
      duration: Date.now() - tenantStart
    });

    // Component assembly
    const componentStart = Date.now();
    if (tenant) {
      const hasComponents = tenant.components.header && tenant.components.footer;
      checks.push({
        name: 'component_assembly',
        status: hasComponents ? 'healthy' : 'degraded',
        duration: Date.now() - componentStart
      });
    }

    const totalDuration = Date.now() - startTime;
    const overallStatus = checks.some(c => c.status === 'degraded') ? 'degraded' : 'healthy';

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      duration: totalDuration,
      checks
    });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
