import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { verifyPaystackSignature } from '@/lib/server/verify-webhook'

export async function POST(req) {
  const payload = await req.json()
  const signature = req.headers.get('x-paystack-signature')

  // 1. Verify the webhook signature to ensure it's from Paystack
  if (!verifyPaystackSignature(payload, signature, process.env.PAYSTACK_SECRET_KEY)) {
    return new NextResponse('Invalid signature', { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    const { event, data } = payload

    if (event === 'charge.success') {
      const payment_id = data.metadata?.payment_id // Assuming we pass our payment_id in metadata
      const transaction_id = data.id

      // 2. Update our payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'completed', transaction_id, processed_at: new Date().toISOString() })
        .eq('id', payment_id)

      if (paymentError) throw paymentError

      // 3. Update the corresponding order
      const { data: payment } = await supabase.from('payments').select('order_id').eq('id', payment_id).single()
      if (payment) {
        await supabase.from('orders').update({ status: 'paid' }).eq('id', payment.order_id)
      }
    }

    return new NextResponse('Webhook processed', { status: 200 })
  } catch (error) {
    console.error('Paystack webhook processing failed:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}