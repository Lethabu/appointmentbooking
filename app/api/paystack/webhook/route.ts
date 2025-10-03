import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    if (event === 'charge.success') {
      const { reference, metadata } = data;
<<<<<<< HEAD

=======
      
>>>>>>> origin/feat/instyle-whitelabel
      if (metadata.bookingDetails) {
        await fetch('/api/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...metadata.bookingDetails,
            payment_reference: reference,
<<<<<<< HEAD
            status: 'confirmed',
          }),
=======
            status: 'confirmed'
          })
>>>>>>> origin/feat/instyle-whitelabel
        });
      }

      if (metadata.items) {
        console.log('Payment successful for items:', metadata.items);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/feat/instyle-whitelabel
