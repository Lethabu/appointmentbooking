import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/auth/callback']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Tenant identification logic
  const host = request.headers.get('host') || ''
  let tenantId = null
  
  // Try to identify tenant by domain or subdomain
  if (host && host !== 'localhost:3000') {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, subdomain, custom_domain')
      .or(`custom_domain.eq.${host},subdomain.eq.${host.split('.')[0]}`)
      .single()
    
    if (tenant) {
      tenantId = tenant.id
      response.headers.set('x-tenant-id', tenantId)
    }
  }

  // Authentication logic
  if (!user && !PUBLIC_PATHS.includes(pathname) && !pathname.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    // Check if user has a salon
    const { data: salon } = await supabase
      .from('salons')
      .select('id, tenant_id')
      .eq('owner_id', user.id)
      .single()

    // Redirect authenticated users away from auth pages
    if (salon && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect to salon creation if no salon exists
    if (!salon && pathname !== '/dashboard/create-salon' && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/dashboard/create-salon', request.url))
    }

    // Set tenant context for API calls
    if (salon && salon.tenant_id) {
      response.headers.set('x-tenant-id', salon.tenant_id)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}