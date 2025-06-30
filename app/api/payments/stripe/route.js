// app/api/payments/stripe/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_SUCCESS_URL = process.env.STRIPE_SUCCESS_URL || 'https://appointmentbookings.co.za/success';
const STRIPE_CANCEL_URL = process.env.STRIPE_CANCEL_URL || 'https://appointmentbookings.co.za/cancel';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export async function POST(req) {
  try {
    const { salon_id, user_id, amount, reference, currency = 'zar' } = await req.json();
    if (!amount || !reference) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Salon Booking: ${reference}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: STRIPE_SUCCESS_URL,
      cancel_url: STRIPE_CANCEL_URL,
      metadata: { salon_id, user_id, reference },
    });

    return NextResponse.json({ success: true, payment_url: session.url, session_id: session.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
