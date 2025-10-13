import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// ============================================================================
// SECURITY FIX #1: Tenant Isolation Middleware
// File: middleware.ts
// Spec: OWASP A01 - Broken Access Control Prevention
// ============================================================================

// Tenant mapping configuration - PER-PRD v13.0
const TENANT_CONFIG: Record<string, { id: string; slug: string; name: string }> = {
  'instylehairboutique.co.za': {
    id: 'tnt_instyle_7c8f9d00a1bc',
    slug: 'instylehairboutique',
    name: 'InStyle Hair Boutique',
  },
  'www.instylehairboutique.co.za': {
    id: 'tnt_instyle_7c8f9d00a1bc',
    slug: 'instylehairboutique',
    name: 'InStyle Hair Boutique',
  },
  'appointmentbooking.co.za': {
    id: 'tnt_platform_default',
    slug: 'platform',
    name: 'Appointment Booking Platform',
  },
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get('host') || '';

  // ========================================================================
  // STEP 1: Bypass middleware for static assets and internal routes
  // ========================================================================
  const bypassPatterns = [
    '/_next',
    '/api/health',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ];

  if (
    bypassPatterns.some((pattern) => pathname.startsWith(pattern)) ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ========================================================================
  // STEP 2: Resolve tenant from hostname
  // ========================================================================
  const tenant = TENANT_CONFIG[hostname];

  if (!tenant) {
    console.error(`[SECURITY] Unknown hostname: ${hostname}`);
    return NextResponse.redirect(new URL('/404', request.url));
  }

  // ========================================================================
  // STEP 3: Inject tenant context into headers (for API routes)
  // ========================================================================
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-id', tenant.id);
  requestHeaders.set('x-tenant-slug', tenant.slug);
  requestHeaders.set('x-tenant-name', tenant.name);

  // ========================================================================
  // STEP 4: Create Supabase client and validate session (for authenticated routes)
  // ========================================================================
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ========================================================================
  // STEP 5: Enforce tenant isolation for authenticated routes
  // ========================================================================
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate user belongs to this tenant
    const userTenantId = session.user.user_metadata?.tenant_id;
    if (userTenantId !== tenant.id) {
      console.error(
        `[SECURITY] Tenant mismatch: User ${session.user.id} attempted to access ${tenant.id}`
      );
      return NextResponse.json(
        { error: 'Forbidden - Tenant access violation' },
        { status: 403 }
      );
    }
  }

  // ========================================================================
  // STEP 6: Rewrite URL for tenant-specific paths (excluding API routes)
  // ========================================================================
  if (!pathname.startsWith('/api/') && !pathname.startsWith(`/${tenant.slug}`)) {
    url.pathname = `/${tenant.slug}${pathname}`;
  }

  // ========================================================================
  // STEP 7: Return response with tenant context
  // ========================================================================
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
};
