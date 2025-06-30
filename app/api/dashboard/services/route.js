import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSessionAndSalon } from '../../../../../appointmentbooking/lib/api-helpers'

export async function GET(req) {
  const { session, salon, error: authError } = await getSessionAndSalon()
  if (authError) return authError

  const supabase = createRouteHandlerClient({ cookies })
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salon.id)
    .order('name', { ascending: true })

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }

  return NextResponse.json(services)
}

export async function POST(req) {
  const { session, salon, error: authError } = await getSessionAndSalon()
  if (authError) return authError

  const body = await req.json()
  const supabase = createRouteHandlerClient({ cookies })
  const { data, error } = await supabase.from('services').insert({ ...body, salon_id: salon.id }).select().single()

  if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })

  return NextResponse.json(data, { status: 201 })
}