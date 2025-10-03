<<<<<<< HEAD
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { resolveTenantFromHostname } from './lib/tenant-resolver';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Resolve tenant configuration
  const tenant = resolveTenantFromHostname(hostname);

  if (tenant) {
    // Create new headers with tenant context
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-id', tenant.id);
    requestHeaders.set('x-tenant-slug', tenant.canonical);
    requestHeaders.set('x-tenant-name', tenant.name);
    requestHeaders.set('x-tenant-domain', tenant.domain);

    // Handle redirect slugs
    const currentSlug = pathname.split('/')[1];
    if (tenant.redirects.includes(currentSlug)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(`/${currentSlug}`, `/${tenant.canonical}`);
      return NextResponse.redirect(url, 301); // Permanent redirect
    }

    // Rewrite to tenant-specific path
    const url = request.nextUrl.clone();
    if (!pathname.startsWith(`/${tenant.canonical}`)) {
      url.pathname = `/${tenant.canonical}${pathname}`;
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders
        }
      });
    }

    // Pass through with tenant headers
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  }

  // Default platform routing
=======

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Define a map of custom domains to tenant slugs
const CUSTOM_DOMAINS: Record<string, string> = {
  'www.instylehairboutique.co.za': 'instylehairboutique',
  'instylehairboutique.co.za': 'instylehairboutique',
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Determine the tenant slug from either custom domain or subdomain
  let slug = CUSTOM_DOMAINS[hostname];
  
  if (!slug) {
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'appointmentbooking' && !hostname.includes('vercel.app')) {
      slug = subdomain;
    }
  }

  // If a tenant is identified, rewrite to their path and set context
  if (slug) {
    const res = NextResponse.next();
    
    // Set tenant context in Supabase for RLS
    const supabase = createMiddlewareClient({ req: request, res });
    try {
      await supabase.rpc('set_tenant_context', { p_tenant_id: slug });
      console.log(`Context set for tenant: ${slug}`);
    } catch (error) {
      console.error(`Failed to set tenant context for ${slug}:`, error);
    }
    
    // Set headers for frontend context
    res.headers.set('x-tenant-id', slug);

    // Rewrite to the tenant-specific path, e.g., /instylehairboutique
    // This serves the content from the directory app/[salon]
    if (!url.pathname.startsWith(`/${slug}`)) {
      url.pathname = `/${slug}${url.pathname}`;
    }
    
    console.log(`Rewriting to: ${url.pathname}`);
    return NextResponse.rewrite(url);
  }
  
  // Otherwise, it's the main marketing site
  console.log('Serving main site');
>>>>>>> origin/feat/instyle-whitelabel
  return NextResponse.next();
}

export const config = {
  matcher: [
<<<<<<< HEAD
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)' 
  ]
=======
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
>>>>>>> origin/feat/instyle-whitelabel
};
