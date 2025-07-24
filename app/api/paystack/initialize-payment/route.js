import { NextResponse } from 'next/server';
import Paystack from 'paystack-node';
import { getSessionAndSalon } from '@/app/lib/api-helpers';

// Initialize Paystack with your Live Secret Key
const paystack = new Paystack(process.env.PAYSTACK_LIVE_SECRET_KEY);

export async function POST(request) {
  try {
    const { session, authError } = await getSessionAndSalon();
    if (authError) return authError;

    const { serviceDetails } = await request.json();

    // Calculate 50% booking fee
    const bookingFee = Math.round(serviceDetails.price * 0.50);

    // Create a payment intent with Paystack
    const paymentIntent = await paystack.transaction.initialize({
      amount: bookingFee * 100, // Paystack expects amount in kobo
      email: session.user.email,
      currency: 'ZAR',
      metadata: {
        serviceId: serviceDetails.id,
        userId: session.user.id,
      },
    });

    // Return the payment reference or authorization URL to the frontend
    return NextResponse.json({
      success: true,
      data: {
        reference: paymentIntent.data.reference,
        authorization_url: paymentIntent.data.authorization_url,
      },
    });
  } catch (error) {
    console.error('Error initializing payment:', error);
    return NextResponse.json({ success: false, error: 'Failed to initialize payment' }, { status: 500 });
  }
}
