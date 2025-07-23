'use server';

import { NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabaseClient';
import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Function to verify Paystack webhook signature
const verifySignature = (payload, signature) => {
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(payload).digest('hex');
  return hash === signature;
};

export async function POST(request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature || !verifySignature(payload, signature)) {
      console.error('Invalid Paystack signature');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(payload);

    // Handle different Paystack event types
    if (event.event === 'charge.success') {
      const { data } = event;
      const { metadata, amount, customer } = data;
      const { salonId, serviceId } = metadata;

      // Ensure amount matches the expected booking fee (50% of service price)
      // This requires fetching the service price again or passing it in metadata
      // For simplicity, we'll assume the amount is correct for now.
      // In a production app, you MUST verify the amount against your service price.

      const bookingData = {
        user_id: customer.id, // Assuming customer.id maps to your user ID
        salon_id: salonId,
        service_id: serviceId,
        // staff_id: metadata.staffId, // If staffId was passed in metadata
        date: metadata.selectedDate, // Assuming selectedDate was passed in metadata
        time: metadata.selectedTime, // Assuming selectedTime was passed in metadata
        status: 'confirmed', // Payment successful, mark as confirmed
        payment_status: 'paid',
        paystack_reference: data.reference
      };

      // Insert the booking into the 'appointments' table
      const { error } = await supabase
        .from('appointments')
        .insert([bookingData]);

      if (error) {
        console.error('Error inserting booking:', error);
        return NextResponse.json({ message: 'Failed to create booking record' }, { status: 500 });
      }

      // Redirect user to a success page or dashboard
      // Note: Server-side redirects are tricky with Next.js API routes.
      // Typically, you'd return a JSON response with a redirect URL,
      // and the client-side would handle the redirection.
      return NextResponse.json({ message: 'Payment successful, booking created', redirectUrl: '/booking-success' });

    } else if (event.event === 'charge.failed') {
      console.log('Payment failed:', event.data);
      // Handle failed payment - e.g., notify user, update status
      return NextResponse.json({ message: 'Payment failed' }, { status: 200 }); // Still return 200 to acknowledge receipt
    }

    // Acknowledge receipt of the event
    return NextResponse.json({ message: 'Event received' }, { status: 200 });

  } catch (error) {
    console.error('Error processing Paystack webhook:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
