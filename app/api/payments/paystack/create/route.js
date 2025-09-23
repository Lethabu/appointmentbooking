import { NextResponse } from 'next/server';
import { createPaystackPayment } from '@/app/lib/services/payment';

export async function POST(req) {
  try {
    const { order_id, amount, email, currency, callback_url } =
      await req.json();
    const payment = await createPaystackPayment(
      order_id,
      amount,
      email,
      currency,
      callback_url,
    );
    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
