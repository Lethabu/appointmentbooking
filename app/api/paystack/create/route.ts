import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const { amount, email, phone, items, tenantId } = await request.json();
    const reference = `instyle_${nanoid(8)}`;

<<<<<<< HEAD
    const paystackResponse = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Amount in kobo (cents)
          currency: 'ZAR',
          email,
          reference,
          metadata: {
            tenantId,
            phone,
            items: JSON.stringify(items),
          },
          callback_url: `https://instylehairboutique.co.za/success?ref=${reference}`,
          cancel_url: `https://instylehairboutique.co.za/shop`,
        }),
      },
    );
=======
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount, // Amount in kobo (cents)
        currency: 'ZAR',
        email,
        reference,
        metadata: {
          tenantId,
          phone,
          items: JSON.stringify(items),
        },
        callback_url: `https://instylehairboutique.co.za/success?ref=${reference}`,
        cancel_url: `https://instylehairboutique.co.za/shop`,
      }),
    });
>>>>>>> origin/feat/instyle-whitelabel

    const data = await paystackResponse.json();

    if (data.status) {
<<<<<<< HEAD
      return NextResponse.json({
        url: data.data.authorization_url,
        reference,
=======
      return NextResponse.json({ 
        url: data.data.authorization_url,
        reference 
>>>>>>> origin/feat/instyle-whitelabel
      });
    } else {
      throw new Error(data.message || 'PayStack initialization failed');
    }
  } catch (error) {
    console.error('PayStack create error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
<<<<<<< HEAD
      { status: 500 },
    );
  }
}
=======
      { status: 500 }
    );
  }
}
>>>>>>> origin/feat/instyle-whitelabel
