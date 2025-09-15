// =============================================================================
// FIXED MIDDLEWARE.TS - Resolves MIDDLEWARE_INVOCATION_FAILED Error
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes matcher
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/api/protected(.*)'
]);

// Define tenant configuration - simplified and edge-runtime safe
const getTenantConfig = (hostname: string) => {
  // Remove any subdomain and check for exact matches
  const cleanHostname = hostname.replace('www.', '');
  
  switch (cleanHostname) {
    case 'instylehairboutique.co.za':
      return {
        tenant: 'instyle',
        rewrite: '/instyle'
      };
    default:
      return null;
  }
};

// Main middleware function
export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    const { pathname, search } = req.nextUrl;
    const hostname = req.headers.get('host') || '';
    
    console.log(`[Middleware] Processing: ${hostname}${pathname}`);

    // Skip middleware for static assets and certain API routes
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/api/webhooks/') ||
      pathname.includes('.') && !pathname.includes('/api/') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml'
    ) {
      console.log(`[Middleware] Skipping static asset: ${pathname}`);
      return NextResponse.next();
    }

    // Get tenant configuration
    const tenantConfig = getTenantConfig(hostname);
    
    if (tenantConfig) {
      console.log(`[Middleware] Tenant detected: ${tenantConfig.tenant}`);
      
      // Handle protected routes
      if (isProtectedRoute(req)) {
        try {
          await auth.protect();
        } catch (error) {
          console.log(`[Middleware] Auth protection failed: ${error}`);
          // Return to sign-in page
          const signInUrl = new URL('/sign-in', req.url);
          signInUrl.searchParams.set('redirect_url', req.url);
          return NextResponse.redirect(signInUrl);
        }
      }
      
      // Create rewrite URL
      const rewriteUrl = new URL(`${tenantConfig.rewrite}${pathname}${search}`, req.url);
      
      console.log(`[Middleware] Rewriting to: ${rewriteUrl.pathname}`);
      
      // Create response with rewrite
      const response = NextResponse.rewrite(rewriteUrl);
      
      // Add tenant headers for API consumption
      response.headers.set('x-tenant', tenantConfig.tenant);
      response.headers.set('x-original-host', hostname);
      response.headers.set('x-pathname', pathname);
      
      return response;
    }

    // Handle www redirects for main domain
    if (hostname.startsWith('www.') && !tenantConfig) {
      const redirectUrl = new URL(req.url);
      redirectUrl.hostname = hostname.replace('www.', '');
      
      console.log(`[Middleware] WWW redirect: ${redirectUrl.toString()}`);
      return NextResponse.redirect(redirectUrl, 301);
    }

    // Default handling for main domain
    if (isProtectedRoute(req)) {
      try {
        await auth.protect();
      } catch (error) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }
    }
    
    console.log(`[Middleware] Default handling: ${pathname}`);
    return NextResponse.next();

  } catch (error) {
    console.error('[Middleware] Error:', error);
    
    // Return a proper error response instead of throwing
    return new NextResponse(
      JSON.stringify({ 
        error: 'Middleware error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        path: req.nextUrl.pathname 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

// Simplified and safer matcher configuration
export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ]
};
