import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.toLowerCase() || '';
  console.log('DEBUG: Raw Hostname:', request.headers.get('host'));
  console.log('DEBUG: Lowercased Hostname:', hostname);
  console.log('DEBUG: Raw Hostname:', request.headers.get('host'));
  console.log('DEBUG: Lowercased Hostname:', hostname);
  console.log('DEBUG: Raw Hostname:', request.headers.get('host'));
  console.log('DEBUG: Lowercased Hostname:', hostname);
  const url = request.nextUrl.clone();
  console.log('🚨 MIDDLEWARE LOG:', {
    hostname,
    pathname: url.pathname,
    headers: Object.fromEntries(request.headers.entries())
  });

  const tenantMap: Record<string, string> = {
    'www.instylehairboutique.co.za': 'instyle',
    'instylehairboutique.co.za': 'instyle',
    'instylehairboutique.appointmentbooking.co.za': 'instyle'
  };
  const tenantId = tenantMap[hostname] || 'default';

  console.log('🚨 TENANT RESOLUTION:', { hostname, tenantId });

  if (tenantId !== 'default') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-id', tenantId);
    requestHeaders.set('x-emergency-mode', 'true');
    requestHeaders.set('X-Content-Type-Options', 'nosniff');

    if (['/book', '/booking'].includes(url.pathname)) {
      url.pathname = '/book';
    }

    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  console.log('⚠️ FALLBACK TO DEFAULT: Serving main landing page');
  return NextResponse.rewrite('/default-landing', { request: { headers: new Headers({ 'x-tenant-id': 'default' }) } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};