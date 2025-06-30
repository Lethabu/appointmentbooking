import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { salonId, clientDetails, cart, total } = await req.json()

  if (!salonId || !clientDetails || !cart || !total) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing required fields for order creation.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Use the service role key for secure backend operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    // 1. Create the main order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        salon_id: salonId,
        customer_name: clientDetails.name,
        customer_email: clientDetails.email,
        customer_phone: clientDetails.phone,
        shipping_address: clientDetails.address,
        total_amount: total,
        status: 'pending_payment'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 2. Create the associated order items
    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price // Price in cents
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) throw itemsError

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order creation failed:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error: ' + error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}