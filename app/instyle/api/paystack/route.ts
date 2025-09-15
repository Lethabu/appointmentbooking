
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const PaymentSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  email: z.string().email("Invalid email"),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    priceCents: z.number()
  }))
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, items } = PaymentSchema.parse(body);

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: amount, // PayStack expects amount in kobo (cents)
        currency: 'ZAR',
        callback_url: `https://instylehairboutique.co.za/booking/success`,
        metadata: {
          items: items,
          tenant: 'instyle'
        }
      })
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'PayStack initialization failed');
    }

    return NextResponse.json({
      success: true,
      checkout_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference
    });

  } catch (error) {
    console.error('PayStack error:', error);
    
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Payment initialization failed" },
      { status: 500 }
    );
  }
}
