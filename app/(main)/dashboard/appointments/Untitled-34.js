import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { salonId, clientDetails, cart, total } = await req.json()

  if (!salonId || !clientDetails || !cart || !total) {
    return new NextResponse('Missing required fields', { status: 400 })
  }

  // Use the service role key for backend operations
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
        customer_address: clientDetails.address,
        total_amount: total,
        status: 'pending_payment'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 2. Create the order items
    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      // Rollback order creation if items fail
      await supabase.from('orders').delete().eq('id', order.id)
      throw itemsError
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order creation failed:', error)
    return new NextResponse('Internal Server Error: ' + error.message, { status: 500 })
  }
}