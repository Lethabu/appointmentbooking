import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single()

  if (!salon) {
    return new NextResponse(JSON.stringify({ error: 'Salon not found' }), { status: 404 })
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, description, price, stock_quantity, image_urls')
    .eq('salon_id', salon.id)
    .order('created_at', { ascending: false })

  if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })

  return NextResponse.json(products)
}