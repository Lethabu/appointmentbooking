import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { verifyNetcashSignature } from '@/lib/server/verify-webhook'

export async function POST(req) {
  const payload = await req.json()
  const signature = req.headers.get('x-netcash-signature')

  // 1. Verify the webhook signature to ensure it's from Netcash
  if (!verifyNetcashSignature(payload, signature, process.env.NETCASH_WEBHOOK_SECRET)) {
    return new NextResponse('Invalid signature', { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    const { reference: payment_id, status, transaction_id } = payload

    // 2. Update our payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: status === 'success' ? 'completed' : 'failed',
        transaction_id: transaction_id,
        processed_at: new Date().toISOString()
      })
      .eq('id', payment_id)

    if (paymentError) throw paymentError

    // 3. If successful, update the corresponding order
    if (status === 'success') {
      const { data: payment } = await supabase.from('payments').select('order_id').eq('id', payment_id).single()
      if (payment) {
        await supabase.from('orders').update({ status: 'paid' }).eq('id', payment.order_id)
      }
    }

    return new NextResponse('Webhook processed', { status: 200 })
  } catch (error) {
    console.error('Netcash webhook processing failed:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}