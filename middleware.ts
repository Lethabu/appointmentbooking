
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

export default clerkMiddleware((auth, req: NextRequest) => {
  // First, check if the route is protected and handle authentication.
  // Using auth().protect() is the recommended best practice.
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || req.nextUrl.hostname;
  const tenantConfig = TENANT_CONFIG[hostname];

  if (tenantConfig) {
    // Check if the path already starts with the rewrite path.
    // This prevents an infinite loop of rewrites.
    if (pathname.startsWith(tenantConfig.rewrite)) {
      return NextResponse.next();
    }

    // Rewrite to the tenant-specific path
    const url = req.nextUrl.clone();
    url.pathname = `${tenantConfig.rewrite}${pathname}`;
    const response = NextResponse.rewrite(url);

    // Add tenant headers for API consumption
    response.headers.set('x-tenant', tenantConfig.tenant);
    response.headers.set('x-original-host', hostname);
    
    return response;
  }
  
  // If no tenant is matched, proceed with the original request.
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
