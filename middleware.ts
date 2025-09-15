
import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define tenant-specific routing
const TENANT_CONFIG: { [key: string]: { tenant: string; rewrite: string } } = {
  'instylehairboutique.co.za': {
    tenant: 'instyle',
    rewrite: '/instyle'
  },
  'www.instylehairboutique.co.za': {
    tenant: 'instyle', 
    rewrite: '/instyle'
  }
};

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/api/protected(.*)'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || req.nextUrl.hostname;
  
  // Skip middleware for static assets and API routes that don't need tenant handling
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/webhook') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If the route is protected, ensure the user is authenticated.
  if (isProtectedRoute(req)) {
    const authResult = await auth();
    if (!authResult.userId) {
      return authResult.redirectToSignIn();
    }
  }

  // Handle tenant routing
  const tenantConfig = TENANT_CONFIG[hostname];
  
  if (tenantConfig) {
    // Rewrite to tenant-specific path
    const url = req.nextUrl.clone();
    url.pathname = `${tenantConfig.rewrite}${pathname}`;
    
    // Add tenant headers for API consumption
    const response = NextResponse.rewrite(url);
    response.headers.set('x-tenant', tenantConfig.tenant);
    response.headers.set('x-original-host', hostname);
    
    return response;
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
