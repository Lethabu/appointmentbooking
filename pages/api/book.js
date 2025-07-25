import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supersaasApiKey = process.env.SUPERSAAS_API_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { salon_id, client_id, service_id, scheduled_time, status } = req.body;

  try {
    // 1. Insert booking into Supabase
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          salon_id,
          client_id,
          service_id,
          scheduled_time,
          status: status || 'pending',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ message: 'Error creating booking in Supabase', error });
    }

    const newBooking = data[0];

    // 2. Make POST request to SuperSaaS API
    const supersaasResponse = await fetch('https://www.supersaas.com/api/bookings.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        api_key: supersaasApiKey,
        booking: {
          schedule_id: process.env.SUPERSAAS_SCHEDULE_ID, // You'll need to configure this
          from: newBooking.scheduled_time, // Use the time from the newly created booking
          service_id: newBooking.service_id, // Map our service_id to SuperSaaS service_id if needed
          name: 'New Booking from Platform', // Placeholder, ideally client name
          email: 'client@example.com', // Placeholder, ideally client email
          // Add other necessary SuperSaaS booking parameters
        },
      }),
    });

    if (!supersaasResponse.ok) {
      const errorData = await supersaasResponse.json();
      console.error('SuperSaaS API error:', errorData);
      // Optionally, you might want to roll back the Supabase insert here
      return res.status(500).json({ message: 'Error creating booking in SuperSaaS', error: errorData });
    }

    const supersaasBooking = await supersaasResponse.json();

    res.status(200).json({ message: 'Booking created successfully', booking: newBooking, supersaasBooking });
  } catch (error) {
    console.error('API handler error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
