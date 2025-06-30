import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/auth/callback']

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // If user is not signed in and is trying to access a protected route
  if (!session && !PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If user is signed in
  if (session) {
    // Check if they have a salon
    const { data: salon } = await supabase
      .from('salons')
      .select('id')
      .eq('owner_id', session.user.id)
      .single()

    // If they are on a public page but have a salon, redirect to dashboard
    if (salon && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If they don't have a salon and are not on the creation page, redirect them
    if (!salon && pathname !== '/dashboard/create-salon') {
      return NextResponse.redirect(new URL('/dashboard/create-salon', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}