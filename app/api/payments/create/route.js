// app/api/payments/create/route.js
import { PaymentService } from '../../../lib/services/paymentService';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { provider, ...paymentDetails } = await req.json();
  // Basic validation
  if (!provider || !paymentDetails.amount) {
      return new NextResponse('Missing provider or amount', { status: 400 });
  }

  try {
    const paymentService = new PaymentService(provider);
    const result = await paymentService.createPaymentIntent(paymentDetails.amount, paymentDetails.currency, paymentDetails.metadata);
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}