import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * A helper function to get the current session and salon for an authenticated user.
 * It centralizes the authorization and tenant-scoping logic for API routes.
 * @returns {Promise<{session: Session|null, salon: Object|null, error: NextResponse|null}>}
 */
export async function getSessionAndSalon() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return { session: null, salon: null, error: new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } }) }
  }

  const { data: salon, error: salonError } = await supabase
    .from('salons')
    .select('id, name, plan') // Select whatever is needed for the context
    .eq('owner_id', session.user.id)
    .single()

  if (salonError || !salon) {
    return { session, salon: null, error: new NextResponse(JSON.stringify({ error: 'Salon not found for user' }), { status: 404, headers: { 'Content-Type': 'application/json' } }) }
  }

  return { session, salon, error: null }
}