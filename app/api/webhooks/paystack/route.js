import { supabase } from '@/app/utils/supabaseClient';

export async function POST(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { event, data } = body;

    if (event === 'charge.successful') {
      // Update booking status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'paid' })
        .eq('id', data.metadata.bookingId);

      if (error) {
        console.error('Error updating booking status:', error);
        return new Response(JSON.stringify({ error: 'Failed to update booking status' }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ message: 'Paystack callback received' }), { status: 200 });
  } catch (err) {
    console.error('Error handling Paystack callback:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}