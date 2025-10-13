// src/pages/api/webhooks/payfast.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || '';

function verifyPayfastSignature(data: any, signature: string): boolean {
  const params = new URLSearchParams();
  Object.keys(data).sort().forEach(key => {
    if (key !== 'signature') params.append(key, data[key]);
  });
  if (PAYFAST_PASSPHRASE) params.append('passphrase', PAYFAST_PASSPHRASE);
  
  const hash = crypto.createHash('md5').update(params.toString()).digest('hex');
  return hash === signature;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { signature, ...data } = req.body;

  if (!verifyPayfastSignature(data, signature)) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (data.payment_status === 'COMPLETE') {
    const bookingId = data.custom_str1;
    if (bookingId) {
      await supabase
        .from('bookings')
        .update({ status: 'confirmed', metadata: { payment_reference: data.pf_payment_id } })
        .eq('id', bookingId);
    }
  }

  res.status(200).json({ received: true });
}