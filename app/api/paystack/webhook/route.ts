import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    if (event === 'charge.success') {
      const { reference, metadata } = data;
      
      if (metadata.bookingDetails) {
        await fetch('/api/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...metadata.bookingDetails,
            payment_reference: reference,
            status: 'confirmed'
          })
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
}