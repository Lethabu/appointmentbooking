import { createClient } from '@supabase/supabase-js';
import axios from 'axios'; // Import axios

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SuperSaaS API configuration
const supersaasApiKey = process.env.SUPERSAAS_API_KEY;
const supersaasScheduleId = process.env.SUPERSAAS_SCHEDULE_ID; // You'll need to get this from SuperSaaS
const supersaasApiUrl = 'https://www.supersaas.com/api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    full_name,
    email,
    phone,
    service_name, // This will be used to find the service_id
    scheduled_time,
    salon_id, // Assuming this comes from the frontend
  } = req.body;

  // Basic validation
  if (!full_name || !email || !phone || !service_name || !scheduled_time || !salon_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 1. Find the service_id from our database using service_name
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('id, duration_minutes') // Fetch duration_minutes for SuperSaaS finish time calculation
      .eq('name', service_name)
      .eq('salon_id', salon_id)
      .single();

    if (serviceError || !serviceData) {
      console.error('Error finding service:', serviceError?.message || 'Service not found');
      return res.status(404).json({ message: 'Service not found or invalid' });
    }

    const service_id = serviceData.id;

    // 2. Insert the new booking into our Supabase 'appointments' table
    const { data: appointment, error: supabaseError } = await supabase
      .from('appointments')
      .insert([
        {
          full_name,
          email,
          phone,
          service_id,
          scheduled_time,
          salon_id,
          status: 'pending', // Default status
        },
      ])
      .select()
      .single();

    if (supabaseError) {
      console.error('Error inserting appointment into Supabase:', supabaseError.message);
      return res.status(500).json({ message: 'Failed to create appointment in our system', error: supabaseError.message });
    }

    console.log('Appointment successfully created in Supabase:', appointment);

    // 3. Make a POST request to the SuperSaaS API to create a corresponding "blocker" appointment
    try {
      const supersaasResponse = await axios.post(
        `${supersaasApiUrl}/bookings.json`,
        {
          booking: {
            schedule_id: supersaasScheduleId,
            name: full_name,
            email: email,
            phone: phone,
            description: `Blocked by Instyle Platform: ${service_name}`, // Custom description
            start: scheduled_time, // Use the same scheduled time
            finish: new Date(new Date(scheduled_time).getTime() + (serviceData.duration_minutes || 60) * 60 * 1000).toISOString(),
          },
        },
        {
          auth: {
            username: supersaasApiKey,
            password: 'x', // SuperSaaS uses 'x' as password when using API key as username
          },
        }
      );

      console.log('SuperSaaS booking created:', supersaasResponse.data);

      // Optionally, update our appointment record with the SuperSaaS booking ID
      await supabase
        .from('appointments')
        .update({ supersaas_id: supersaasResponse.data.booking.id })
        .eq('id', appointment.id);

    } catch (supersaasError) {
      console.error('Error creating booking in SuperSaaS:', supersaasError.response?.data || supersaasError.message);
      // Mark Supabase booking as 'supersaas_sync_failed'
      await supabase
        .from('appointments')
        .update({ status: 'supersaas_sync_failed' })
        .eq('id', appointment.id);
      return res.status(500).json({ message: 'Appointment created in our system, but failed to sync with SuperSaaS.', error: supersaasError.message });
    }

    return res.status(201).json({ message: 'Booking created successfully and synced with SuperSaaS', appointment });

  } catch (error) {
    console.error('Unhandled error in API route:', error.message);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
