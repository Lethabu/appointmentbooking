import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Find the salon for the logged-in owner
  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single()

  if (!salon) {
    return new NextResponse('Salon not found for owner', { status: 404 })
  }

  // Fetch orders for that salon, including related items and products
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      customer_name,
      customer_email,
      customer_address,
      total_amount,
      status,
      order_items (
        quantity,
        price_at_purchase,
        products ( name, image_urls )
      )
    `)
    .eq('salon_id', salon.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return new NextResponse('Internal Server Error: ' + error.message, { status: 500 })
  }

  return NextResponse.json(orders)
}