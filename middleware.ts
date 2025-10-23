import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/middleware';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Bypass internal, asset, and API paths
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Create Supabase client and fetch tenant
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);
  const { data: tenant } = await supabase
    .from('tenants')
    .select('slug')
    .or(`custom_domain.eq.${hostname},subdomain.eq.${hostname.split('.')[0]}`)
    .single();

  if (tenant) {
    // Rewrite to the dynamic tenant path
    url.pathname = `/${tenant.slug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Explicitly rewrite the main domain to the root to resolve the 404
  if (hostname === 'appointmentbooking.co.za' || hostname === 'www.appointmentbooking.co.za') {
    url.pathname = `/`;
    return NextResponse.rewrite(url);
  }

  // Fallback for any other case
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
