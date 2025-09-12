// tenant-wrapper/middleware.ts - Bulletproof tenant resolution
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Hardcoded tenant mapping for emergency reliability
const TENANT_DOMAINS = new Map([
  ['www.instylehairboutique.co.za', 'instyle'],
  ['instylehairboutique.co.za', 'instyle'],
  ['instylehairboutique.appointmentbooking.co.za', 'instyle']
]);

const TENANT_CONFIG = {
  instyle: {
    name: 'InStyle Hair Boutique',
    primaryColor: '#d946ef',
    logo: '/logos/instyle-logo.svg'
  }
};

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.toLowerCase() || '';
  const url = request.nextUrl.clone();
  
  console.log(`🔍 MIDDLEWARE: ${hostname}${url.pathname}`);
  
  // Get tenant ID
  const tenantId = TENANT_DOMAINS.get(hostname);
  
  if (!tenantId) {
    console.log(`❌ NO TENANT FOUND: ${hostname}`);
    // Redirect unknown domains to main platform
    return NextResponse.redirect('https://appointmentbooking.co.za');
  }
  
  console.log(`✅ TENANT RESOLVED: ${hostname} -> ${tenantId}`);
  
  // Set tenant context headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-id', tenantId);
  requestHeaders.set('x-tenant-domain', hostname);
  
  // Rewrite to tenant-specific path
  if (url.pathname === '/') {
    url.pathname = `/${tenantId}`;
  } else if (!url.pathname.startsWith(`/${tenantId}`)) {
    url.pathname = `/${tenantId}${url.pathname}`;
  }
  
  console.log(`🔄 REWRITING: ${hostname}${request.nextUrl.pathname} -> ${url.pathname}`);
  
  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders }
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logos).*)',
  ],
};
