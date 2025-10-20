import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

export async function createCheckoutSession(data: unknown) {
  // This is a dummy function.
  // In a real application, this would create a checkout session with Stripe.
  console.log('Creating checkout session with data:', data);
  return { error: 'Stripe is not implemented yet.' };
}

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export function verifyStripeSignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!secret) return false;
  try {
    stripe.webhooks.constructEvent(payload, signature, secret);
    return true;
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return false;
  }
}
