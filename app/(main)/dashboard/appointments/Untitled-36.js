import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { order_id } = params

  if (!order_id) {
    return new NextResponse('Order ID is required', { status: 400 })
  }

  // This uses the public ANON key, as this is a public-facing page.
  // The non-guessable UUID of the order provides a layer of security.
  // For higher security, you could implement a signed URL or token-based access.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        customer_name,
        customer_email,
        total_amount,
        order_items (
          quantity,
          price_at_purchase,
          products (
            name,
            image_urls
          )
        )
      `)
      .eq('id', order_id)
      .single()

    if (orderError) throw orderError
    if (!order) return new NextResponse('Order not found', { status: 404 })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return new NextResponse('Internal Server Error: ' + error.message, { status: 500 })
  }
}