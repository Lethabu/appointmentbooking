import { NextResponse } from 'next/server';
import Paystack from 'paystack-node';

// Initialize Paystack with your Live Secret Key
const paystack = new Paystack(process.env.PAYSTACK_LIVE_SECRET_KEY);

export async function POST(request) {
  try {
    const { serviceDetails } = await request.json();

    // Calculate 50% booking fee
    const bookingFee = Math.round(serviceDetails.price * 0.50);

    // Create a payment intent with Paystack
    const paymentIntent = await paystack.createPaymentIntent({
      amount: bookingFee,
      currency: 'ZAR', // Assuming ZAR as the currency
      metadata: {
        serviceId: serviceDetails.id,
        // Add any other relevant metadata
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
