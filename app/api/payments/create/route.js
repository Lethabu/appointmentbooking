import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export default async function handler(req, res) {
  const { orderId, amount, returnUrl, provider } = await req.json()

  if (!orderId || !amount || !returnUrl || !provider) {
    return new NextResponse(JSON.stringify({ error: 'Missing required payment fields' }), { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    // 1. Create a payment record in our DB
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        amount: amount,
        provider: provider, // 'netcash_payflex' or 'paystack'
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    // 2. In a real app, call the respective payment gateway API here to get a real payment URL.
    // For now, we'll simulate the redirect URLs.
    let paymentUrl = ''
    if (provider === 'netcash_payflex') {
      paymentUrl = `https://paygate.netcash.co.za/process?merchant_id=${process.env.NETCASH_MERCHANT_ID}&amount=${amount}&reference=${payment.id}&return_url=${returnUrl}`
    } else if (provider === 'paystack') {
      // Paystack's API would be called here to get an authorization_url
      paymentUrl = `https://checkout.paystack.com/sim/payment_auth_url_from_api` // Simulated
    } else {
      throw new Error('Unsupported payment provider')
    }

    await supabase.from('payments').update({ status: 'redirected' }).eq('id', payment.id)

    return NextResponse.json({ success: true, url: paymentUrl })
  } catch (error) {
    console.error('Payment initiation failed:', error)
    return new NextResponse(JSON.stringify({ error: 'Payment processing error' }), { status: 500 })
  }
}