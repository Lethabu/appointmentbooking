import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function getSessionAndSalon() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return { error: new NextResponse('Unauthorized', { status: 401 }) }
  }

  const { data: salon, error: salonError } = await supabase
    .from('salons')
    .select('id, plan')
    .eq('owner_id', session.user.id)
    .single()

  if (salonError || !salon) {
    return { error: new NextResponse('Salon not found for user', { status: 404 }) }
  }

  // Return everything needed by the route handlers
  return { session, salon, supabase, error: null }
}