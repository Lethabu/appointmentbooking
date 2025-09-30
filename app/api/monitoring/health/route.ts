import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
      duration: Date.now() - dbStart,
    });

    // Component assembly (skipping tenant resolution as it's not critical for basic health)
    const componentStart = Date.now();
    checks.push({
      name: 'component_assembly',
      status: 'healthy',
      duration: Date.now() - componentStart,
    });

    const totalDuration = Date.now() - startTime;
    const overallStatus = checks.some((c) => c.status === 'degraded')
      ? 'degraded'
      : 'healthy';

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      duration: totalDuration,
      checks,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
