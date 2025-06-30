import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function getSalonForOwner(supabase, userId) {
  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', userId)
    .single()
  return salon
}

export async function GET(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const salon = await getSalonForOwner(supabase, session.user.id)
  if (!salon) return new NextResponse('No salon found for owner', { status: 404 })

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salon.id)
    .order('name', { ascending: true })

  return NextResponse.json(services)
}

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const salon = await getSalonForOwner(supabase, session.user.id)
  if (!salon) {
    return new NextResponse('No salon found for owner', { status: 404 })
  }

  const body = await req.json()
  const { data, error } = await supabase
    .from('services')
    .insert({ ...body, salon_id: salon.id })
    .select()
    .single()

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  return NextResponse.json(data)
}