import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { orderId, amount, returnUrl } = await req.json()

  if (!orderId || !amount || !returnUrl) {
    return new NextResponse('Missing required payment fields', { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    // 1. Create a payment record in our DB
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        amount: amount,
        provider: 'netcash_payflex',
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    // 2. In a real app, call the Netcash API here to get a real payment URL.
    // For now, we'll simulate a redirect URL.
    const simulatedPaymentUrl = `/order/complete?payment_id=${payment.id}&status=success`

    return NextResponse.json({ success: true, url: simulatedPaymentUrl })
  } catch (error) {
    console.error('Payment initiation failed:', error)
    return new NextResponse('Internal Server Error: ' + error.message, { status: 500 })
  }
}