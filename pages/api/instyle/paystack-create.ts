// pages/api/instyle/paystack-create.ts
// This is a placeholder for the PayStack create checkout API endpoint.

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // Logic to create PayStack checkout URL
    res.status(200).json({ url: 'https://paystack.com/checkout-url' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
