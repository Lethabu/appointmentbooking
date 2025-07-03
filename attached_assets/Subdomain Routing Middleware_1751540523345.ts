// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const host = req.headers.get('host') || ''
  
  // Extract subdomain (saas-app.com or localhost:3000)
  const subdomain = host.includes('.')
    ? host.split('.')[0]
    : host.split(':')[0];
  
  // Skip for main domain
  if (['appointmentbookings', 'www', 'localhost'].includes(subdomain)) {
    return res;
  }

  // Fetch salon
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name, logo_url, plan')
    .or(`subdomain.eq.${subdomain}, custom_domain.eq.${host}`)
    .single();

  if (salon) {
    // Set salon context in headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-salon-id', salon.id);
    
    // Clone response to modify headers
    const response = NextResponse.next({
      request: { headers: requestHeaders }
    });
    
    // Pass salon data to client via cookies
    response.cookies.set('salon-data', JSON.stringify({
      name: salon.name,
      logo: salon.logo_url,
      plan: salon.plan
    }));
    
    return response;
  }

  // Salon not found - redirect to main site
  return NextResponse.redirect(new URL('/', req.url));
}