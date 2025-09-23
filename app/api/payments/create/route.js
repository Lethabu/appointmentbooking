import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, customer_email, tenant_id } = await request.json();

    // Paystack integration for African payments
    const paymentData = {
      email: customer_email,
      amount: amount, // Amount in kobo
      currency: 'ZAR',
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking-success`,
      metadata: {
        tenant_id,
        service: 'Appointment Booking',
      },
    };

    const response = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      },
    );

    const result = await response.json();

    return NextResponse.json({
      payment_url: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
