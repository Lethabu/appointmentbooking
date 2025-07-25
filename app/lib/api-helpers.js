import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function getSessionAndSalon() {
  const cookieStore = cookies()
  const testMode = cookieStore.get('test_mode') === 'enabled';
  const testSalonId = cookieStore.get('test_salon_id');

  if (testMode) {
    // Always mock salon and session if test mode is enabled
    return {
      supabase: createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            get(name) {
              return cookieStore.get(name)?.value
            },
          },
        }
      ),
      salon: { id: testSalonId || 'test-salon-id' }, // Use provided ID or a default
      session: { user: { email: 'test@example.com', id: 'test-user-id' } }, // Mock session
      error: null
    };
  }

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