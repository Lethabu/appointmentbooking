import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supersaasApiKey = process.env.SUPERSAAS_API_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Fetch recent bookings from SuperSaaS
    const supersaasResponse = await fetch(
      `https://www.supersaas.com/api/bookings.json?api_key=${supersaasApiKey}&from=${oneHourAgo.toISOString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!supersaasResponse.ok) {
      const errorData = await supersaasResponse.json();
      console.error('SuperSaaS API fetch error:', errorData);
      return res.status(500).json({
        message: 'Error fetching bookings from SuperSaaS',
        error: errorData,
      });
    }

    const { bookings: supersaasBookings } = await supersaasResponse.json();

    if (!supersaasBookings || supersaasBookings.length === 0) {
      return res
        .status(200)
        .json({ message: 'No new bookings from SuperSaaS to sync.' });
    }

    // Get existing appointments from Supabase to avoid duplicates
    const { data: existingAppointments, error: existingError } = await supabase
      .from('appointments')
      .select('supersaas_booking_id') // Assuming you add a column to store SuperSaaS booking ID
      .in(
        'supersaas_booking_id',
        supersaasBookings.map((b) => b.id), // SuperSaaS booking IDs
      );

    if (existingError) {
      console.error('Supabase fetch error:', existingError);
      return res.status(500).json({
        message: 'Error fetching existing appointments from Supabase',
        error: existingError,
      });
    }

    const existingSupersaasIds = new Set(
      existingAppointments.map((a) => a.supersaas_booking_id),
    );

    const bookingsToInsert = supersaasBookings
      .filter((b) => !existingSupersaasIds.has(b.id))
      .map((b) => ({
        salon_id: process.env.SUPERSAAS_SALON_ID, // You'll need to configure this
        client_id: null, // You'll need logic to map SuperSaaS client to our profile or create new
        service_id: null, // You'll need logic to map SuperSaaS service to our service
        scheduled_time: b.start_time, // Adjust to match your schema's column name
        status: 'scheduled', // Default status
        supersaas_booking_id: b.id, // Store SuperSaaS booking ID
        // Map other relevant SuperSaaS booking fields to your Supabase schema
      }));

    if (bookingsToInsert.length > 0) {
      const { data: insertedBookings, error: insertError } = await supabase
        .from('appointments')
        .insert(bookingsToInsert)
        .select();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return res.status(500).json({
          message: 'Error inserting new bookings into Supabase',
          error: insertError,
        });
      }
      return res.status(200).json({
        message: `Successfully synced ${insertedBookings.length} bookings.`,
        insertedBookings,
      });
    } else {
      return res
        .status(200)
        .json({ message: 'No new bookings to insert into Supabase.' });
    }
  } catch (error) {
    console.error('API handler error:', error);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
}
