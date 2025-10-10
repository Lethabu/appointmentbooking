import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase';

// This webhook is a duplicate of app/api/paystack/webhook/route.ts
// Consolidating logic here to resolve build errors.

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const signature = request.headers.get('x-paystack-signature');
  const body = await request.text();

  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const { event, data } = JSON.parse(body);

  if (event === 'charge.success') {
    console.log(`Processing successful charge: ${data.reference}`);
    // The logic from app/api/paystack/webhook/route.ts should be used.
    // This file can be deleted after confirming the build is stable.
  }

  return NextResponse.json({ received: true });
}