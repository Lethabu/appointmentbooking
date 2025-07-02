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
      },
    }
  )

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return { authError: new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } }) }
  }

  const { data: salon, error: salonError } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single()

  if (salonError || !salon) {
    return { authError: new NextResponse(JSON.stringify({ error: 'Salon not found or permission denied' }), { status: 404, headers: { 'Content-Type': 'application/json' } }) }
  }

  return { supabase, session, salon }
}