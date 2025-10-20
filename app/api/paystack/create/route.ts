import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const { amount, email, tenantId } = await request.json();

    if (!amount || !email || !tenantId) {
      return NextResponse.json({ error: 'Amount, email, and tenantId are required' }, { status: 400 });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key is not configured.');
    }

    const reference = nanoid(); // Generate unique reference

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Amount in kobo
        reference,
        metadata: {
          tenantId: tenantId,
          source: 'appointmentbooking-saas'
        }
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error('Paystack API Error:', data);
      return NextResponse.json({ error: 'Failed to initialize payment', details: data.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, authorization_url: data.data.authorization_url });

  } catch (error) {
    console.error('Create Paystack transaction error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: 'Failed to create transaction', details: errorMessage }, { status: 500 });
  }
}