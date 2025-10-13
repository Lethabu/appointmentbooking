// src/pages/api/webhooks/paystack.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET!;

function verifyPaystackSignature(payload: string, signature: string): boolean {
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET).update(payload).digest('hex');
  return hash === signature;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const signature = req.headers['x-paystack-signature'] as string;
  const payload = JSON.stringify(req.body);

  if (!verifyPaystackSignature(payload, signature)) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const { event, data } = req.body;

  if (event === 'charge.success') {
    const bookingId = data.metadata?.booking_id;
    if (bookingId) {
      await supabase
        .from('bookings')
        .update({ status: 'confirmed', metadata: { payment_reference: data.reference } })
        .eq('id', bookingId);
    }
  }

  res.status(200).json({ received: true });
}