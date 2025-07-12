// lib/services/providers/stripeProvider.js
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_SUCCESS_URL = process.env.STRIPE_SUCCESS_URL || 'https://appointmentbookings.co.za/success';
const STRIPE_CANCEL_URL = process.env.STRIPE_CANCEL_URL || 'https://appointmentbookings.co.za/cancel';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export class StripeProvider {
  async createPayment(details) {
    const { amount, reference, currency = 'zar', salon_id, user_id } = details;

    if (!amount || !reference) {
      throw new Error('Missing required fields for Stripe payment');
    }

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

    return { success: true, payment_url: session.url, session_id: session.id };
  }
}