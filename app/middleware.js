import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl.clone()
  const testMode = req.cookies.get('test_mode') === 'enabled'

  if (testMode && url.pathname.startsWith('/dashboard')) {
    // Bypass authentication for test mode
    url.pathname = '/dashboard/test'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
