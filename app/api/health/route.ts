import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { createTenantClient, getTenantContext } from '@/lib/supabase-server';

interface HealthCheckResult {
  status: 'pass' | 'fail' | 'warn';
  responseTime?: number;
  error?: string;
  details?: any;
}

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: HealthCheckResult;
    openai?: HealthCheckResult;
    whatsapp?: HealthCheckResult;
    tenant_isolation?: HealthCheckResult;
    external_apis?: HealthCheckResult[];
  };
}

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 * Kubernetes-style health check with dependency validation
 */
export async function GET(request: NextRequest): Promise<NextResponse<HealthCheck>> {
  const startTime = Date.now();

  // Initialize checks
  const checks: HealthCheck['checks'] = {
    database: { status: 'fail' as const },
  };

  // Get environment info
  const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
  const version = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'unknown';

  try {
    // ======================================================================
    // CHECK 1: Database Connectivity
    // ======================================================================
    try {
      const supabase = createClient();
      const dbStart = Date.now();

      // Multi-step database check
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single();

      checks.database = {
        status: error ? 'fail' : 'pass',
        responseTime: Date.now() - dbStart,
        error: error?.message,
      };
    } catch (error: any) {
      checks.database = {
        status: 'fail',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }

    // ======================================================================
    // CHECK 2: OpenAI API (if configured)
    // ======================================================================
    if (process.env.OPENAI_API_KEY) {
      try {
        const aiStart = Date.now();

        // Quick connectivity check
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          signal: AbortSignal.timeout(5000),
        });

        checks.openai = {
          status: response.ok ? 'pass' : 'fail',
          responseTime: Date.now() - aiStart,
          details: `HTTP ${response.status}`,
        };
      } catch (error: any) {
        checks.openai = {
          status: 'fail',
          responseTime: Date.now() - startTime,
          error: error.message,
        };
      }
    }

    // ======================================================================
    // CHECK 3: WhatsApp API (if configured)
    // ======================================================================
    if (process.env.WHATSAPP_API_TOKEN) {
      try {
        const waStart = Date.now();

        // Ping WhatsApp health endpoint if available
        const waUrl = process.env.WHATSAPP_API_URL;
        if (waUrl) {
          const response = await fetch(`${waUrl}/health`, {
            signal: AbortSignal.timeout(3000),
          });

          checks.whatsapp = {
            status: response.ok ? 'pass' : 'warn',
            responseTime: Date.now() - waStart,
            details: `HTTP ${response.status}`,
          };
        } else {
          checks.whatsapp = {
            status: 'warn',
            responseTime: 0,
            error: 'WhatsApp API URL not configured',
          };
        }
      } catch (error: any) {
        checks.whatsapp = {
          status: 'fail',
          responseTime: Date.now() - startTime,
          error: error.message,
        };
      }
    }

    // ======================================================================
    // CHECK 4: Tenant Isolation (Advanced Check for Production)
    // ======================================================================
    try {
      const tenantStart = Date.now();

      // Only test tenant isolation in production or if we're on a tenant domain
      const hostname = request.headers.get('host') || '';
      if (environment === 'production' || hostname.includes('instyle')) {
        // Test the tenant context from middleware
        const tenantId = request.headers.get('x-tenant-id');

        if (tenantId) {
          // Attempt to verify tenant isolation by making a scoped query
          const tenantContext = getTenantContext(request.headers);
          const tenantClient = createTenantClient(tenantContext);

          // This would have tenant_id automatically injected
          const { error } = await tenantClient.from('services').select('id').limit(1);

          checks.tenant_isolation = {
            status: error ? 'fail' : 'pass',
            responseTime: Date.now() - tenantStart,
            details: error ? { tenantId, error: error.message } : { tenantId },
          };
        } else {
          checks.tenant_isolation = {
            status: environment === 'production' ? 'fail' : 'warn',
            responseTime: 0,
            error: 'No tenant context in headers',
          };
        }
      }
    } catch (error: any) {
      checks.tenant_isolation = {
        status: 'fail',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }

    // ======================================================================
    // CHECK 5: External API Dependencies (Production Only)
    // ======================================================================
    if (environment === 'production') {
      checks.external_apis = await checkExternalDependencies();
    }

  } catch (error: any) {
    console.error('[HEALTH CHECK ERROR]', error);
    // Continue with partial results
  }

  // ========================================================================
  // DETERMINE OVERALL HEALTH STATUS
  // ========================================================================
  const hasFailures = Object.values(checks).some(check => {
    if (Array.isArray(check)) {
      return check.some(subCheck => subCheck.status === 'fail');
    }
    return (check as HealthCheckResult).status === 'fail';
  });

  const hasWarnings = Object.values(checks).some(check => {
    if (Array.isArray(check)) {
      return check.some(subCheck => subCheck.status === 'warn');
    }
    return (check as HealthCheckResult).status === 'warn';
  });

  let overallStatus: 'healthy' | 'unhealthy' | 'degraded';
  let httpStatus: number;

  if (hasFailures) {
    overallStatus = 'unhealthy';
    httpStatus = 503; // Service Unavailable
  } else if (hasWarnings) {
    overallStatus = 'degraded';
    httpStatus = 200; // OK but degraded
  } else {
    overallStatus = 'healthy';
    httpStatus = 200; // OK
  }

  const response: HealthCheck = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version,
    environment,
    checks,
  };

  return NextResponse.json(response, { status: httpStatus });
}

/**
 * Check external API dependencies in production
 */
async function checkExternalDependencies(): Promise<HealthCheckResult[]> {
  const externalChecks: HealthCheckResult[] = [];

  // Add additional external service checks here as business grows
  // Example: Payment providers, SMS gateways, etc.
  // Currently empty array to maintain structure

  return externalChecks;
}
