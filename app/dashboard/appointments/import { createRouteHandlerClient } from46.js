import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function getSalonForOwner(supabase, userId) {
  const { data: salon } = await supabase
    .from('salons')
    .select('id, plan')
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

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('salon_id', salon.id)
    .order('name', { ascending: true })

  return NextResponse.json(products)
}

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const salon = await getSalonForOwner(supabase, session.user.id)
  // E-commerce is a feature for Pro and Elite tiers
  if (!salon || (salon.plan !== 'pro' && salon.plan !== 'elite')) {
    return new NextResponse('E-commerce features require a Pro or Elite plan.', { status: 403 })
  }

  const body = await req.json()
  const { data, error } = await supabase
    .from('products')
    .insert({ ...body, salon_id: salon.id })
    .select()
    .single()

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  return NextResponse.json(data)
}