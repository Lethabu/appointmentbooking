import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SuperSaaS API configuration
const supersaasApiKey = process.env.SUPERSAAS_API_KEY;
const supersaasScheduleId = process.env.SUPERSAAS_SCHEDULE_ID; // You'll need to get this from SuperSaaS
const supersaasApiUrl = 'https://www.supersaas.com/api';

export default async function handler(req, res) {
  // This function is designed to be triggered by a cron job, so it might not receive a typical HTTP request.
  // However, Vercel Cron Jobs trigger serverless functions via HTTP requests.
  // We can add a simple check for a secret token if we want to secure it further.

  if (req.method && req.method !== 'GET') { // Cron jobs typically use GET, but can be POST
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  console.log('Starting SuperSaaS sync...');

  try {
    // Calculate the time one hour ago to fetch recent bookings
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Fetch recent bookings from SuperSaaS
    const supersaasResponse = await axios.get(
      `${supersaasApiUrl}/bookings.json`,
      {
        params: {
          schedule_id: supersaasScheduleId,
          from: oneHourAgo, // Fetch bookings from the last hour
          // You might need to adjust 'from' and 'to' parameters based on SuperSaaS API capabilities
          // and how you want to handle pagination/incremental sync.
        },
        auth: {
          username: supersaasApiKey,
          password: 'x',
        },
      }
    );

    const supersaasBookings = supersaasResponse.data.bookings; // SuperSaaS API returns 'bookings' array

    if (!supersaasBookings || supersaasBookings.length === 0) {
      console.log('No new bookings found in SuperSaaS in the last hour.');
      return res.status(200).json({ message: 'No new bookings to sync.' });
    }

    console.log(`Found ${supersaasBookings.length} new bookings in SuperSaaS. Attempting to sync...`);

    let syncedCount = 0;
    let skippedCount = 0;

    for (const ssBooking of supersaasBookings) {
      try {
        // Check if the booking already exists in our Supabase DB using supersaas_id
        const { data: existingAppointment, error: fetchError } = await supabase
          .from('appointments')
          .select('id')
          .eq('supersaas_id', ssBooking.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
          console.error(`Error checking for existing appointment (SuperSaaS ID: ${ssBooking.id}):`, fetchError.message);
          skippedCount++;
          continue;
        }

        if (existingAppointment) {
          console.log(`Booking with SuperSaaS ID ${ssBooking.id} already exists. Skipping.`);
          skippedCount++;
          continue;
        }

        // Find the service_id from our database using service name from SuperSaaS
        // This assumes a mapping between SuperSaaS description and our service names
        const serviceName = ssBooking.description; // Or another field that maps to your service name
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('id, salon_id, duration_minutes') // Also fetch salon_id and duration if needed
          .eq('name', serviceName)
          .single();

        if (serviceError || !serviceData) {
          console.warn(`Could not find matching service for SuperSaaS booking description: "${serviceName}". Skipping booking ${ssBooking.id}.`, serviceError?.message);
          skippedCount++;
          continue;
        }

        // Insert the new booking into our Supabase 'appointments' table
        const { error: insertError } = await supabase
          .from('appointments')
          .insert([
            {
              full_name: ssBooking.name,
              email: ssBooking.email,
              phone: ssBooking.phone,
              service_id: serviceData.id,
              scheduled_time: ssBooking.start, // SuperSaaS 'start' is typically ISO string
              salon_id: serviceData.salon_id, // Use salon_id from the service
              status: 'confirmed', // Assume SuperSaaS bookings are confirmed
              supersaas_id: ssBooking.id,
            },
          ]);

        if (insertError) {
          console.error(`Error inserting SuperSaaS booking ${ssBooking.id} into Supabase:`, insertError.message);
          skippedCount++;
        } else {
          syncedCount++;
        }
      } catch (innerError) {
        console.error(`Unexpected error processing SuperSaaS booking ${ssBooking.id}:`, innerError.message);
        skippedCount++;
      }
    }

    console.log(`SuperSaaS sync complete. Synced: ${syncedCount}, Skipped: ${skippedCount}`);
    return res.status(200).json({ message: 'SuperSaaS sync completed successfully', syncedCount, skippedCount });

  } catch (error) {
    console.error('Error during SuperSaaS sync:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to sync with SuperSaaS', error: error.message });
  }
}