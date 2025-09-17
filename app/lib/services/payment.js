import { nanoid } from 'nanoid';
import { createClient } from '@supabase/supabase-js';

export async function createPaystackPayment(
  order_id,
  amount,
  email,
  currency = 'ZAR',
  callback_url,
) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error('Payment gateway configuration error');
  }
  if (!amount || !email || !order_id) {
    throw new Error('Missing required fields: amount, email, order_id');
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const paymentReference = `ps_${nanoid(12)}`;

  const { data: paymentRecord, error: paymentInsertError } = await supabase
    .from('payments')
    .insert({
      order_id: order_id,
      amount: amount,
      currency: currency,
      status: 'pending',
      method: 'paystack',
      gateway_reference: paymentReference,
    })
    .select()
    .single();

  if (paymentInsertError || !paymentRecord) {
    throw new Error('Failed to initiate payment record');
  }

  const paystackResponse = await fetch(
    'https://api.paystack.co/transaction/initialize',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        amount: amount,
        currency: currency,
        reference: paymentReference,
        callback_url:
          callback_url ||
          `${process.env.NEXT_PUBLIC_SITE_URL}/order/complete?payment_ref=${paymentReference}&payment_id=${paymentRecord.id}`,
        metadata: {
          order_id: order_id,
          payment_db_id: paymentRecord.id,
        },
      }),
    },
  );

  const paystackData = await paystackResponse.json();

  if (!paystackData.status || !paystackData.data.authorization_url) {
    await supabase
      .from('payments')
      .update({ status: 'failed_initiation' })
      .eq('id', paymentRecord.id);
    throw new Error('Payment gateway initialization failed');
  }

  await supabase
    .from('payments')
    .update({ status: 'redirected' })
    .eq('id', paymentRecord.id);

  return {
    authorization_url: paystackData.data.authorization_url,
    access_code: paystackData.data.access_code,
    reference: paystackData.data.reference,
  };
}
