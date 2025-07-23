'use strict';

console.log('Migration script started.'); // Added for confirmation

// Load environment variables from .env file
require('dotenv').config();

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// --- Configuration ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPERSAAS_API_KEY = process.env.SUPERSAAS_API_KEY; // Ensure this is set in your environment
const SUPERSAAS_API_URL = 'https://www.supersaas.com/api';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPERSAAS_API_KEY) {
  console.error('Missing environment variables. Please ensure SUPABASE_URL, SUPABASE_ANON_KEY, and SUPERSAAS_API_KEY are set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Helper Functions ---

// Function to fetch bookings from SuperSaaS
async function fetchSuperSaasBookings() {
  console.log('Fetching bookings from SuperSaaS...');
  try {
    const response = await axios.get(`${SUPERSAAS_API_URL}/bookings`, {
      headers: {
        'Authorization': `Bearer ${SUPERSAAS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Successfully fetched ${response.data.length} bookings from SuperSaaS.`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SuperSaaS bookings:', error.response?.data || error.message);
    throw new Error('Failed to fetch bookings from SuperSaaS.');
  }
}

// Function to get Supabase user ID by email
async function getSupabaseUserId(email) {
  if (!email) return null;
  try {
    const { data, error } = await supabase
      .from('auth.users') // Assuming user emails are in auth.users table
      .select('id')
      .eq('email', email)
      .single();
    
    if (error) {
      console.warn(`Could not find Supabase user for email: ${email}`, error.message);
      return null;
    }
    return data.id;
  } catch (error) {
    console.error(`Error finding Supabase user for email ${email}:`, error.message);
    return null;
  }
}

// Function to get Supabase service ID by name (or other identifier)
async function getSupabaseServiceId(serviceName) {
  if (!serviceName) return null;
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id')
      .ilike('name', `%${serviceName}%`) // Using ilike for partial match, adjust as needed
      .single();
    
    if (error) {
      console.warn(`Could not find Supabase service for name: ${serviceName}`, error.message);
      return null;
    }
    return data.id;
  } catch (error) {
    console.error(`Error finding Supabase service for name ${serviceName}:`, error.message);
    return null;
  }
}

// Function to get Supabase staff ID by name (or other identifier)
async function getSupabaseStaffId(staffName) {
  if (!staffName) return null;
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('id')
      .ilike('name', `%${staffName}%`) // Using ilike for partial match, adjust as needed
      .single();
    
    if (error) {
      console.warn(`Could not find Supabase staff for name: ${staffName}`, error.message);
      return null;
    }
    return data.id;
  } catch (error) {
    console.error(`Error finding Supabase staff for name ${staffName}:`, error.message);
    return null;
  }
}

// Function to transform SuperSaaS booking data to Supabase format
async function transformBooking(ssBooking) {
  // --- IMPORTANT: Adjust these mappings based on actual SuperSaaS data structure ---
  // You'll need to inspect the data from fetchSuperSaasBookings() to know the exact field names.
  
  const userId = await getSupabaseUserId(ssBooking.customer_email); // Assuming SuperSaaS provides customer email
  const serviceId = await getSupabaseServiceId(ssBooking.service_name); // Assuming SuperSaaS provides service name
  const staffId = await getSupabaseStaffId(ssBooking.staff_name); // Assuming SuperSaaS provides staff name

  // Basic validation: Ensure we have at least a user and a service to create a booking
  if (!userId || !serviceId) {
    console.warn(`Skipping booking ${ssBooking.id} due to missing user or service mapping.`);
    return null;
  }

  return {
    user_id: userId,
    salon_id: ssBooking.salon_id, // Assuming salon_id is available or can be inferred
    service_id: serviceId,
    staff_id: staffId, // This might be null if staff mapping fails
    date: ssBooking.booking_date, // Assuming date format is compatible or needs parsing
    time: ssBooking.booking_time, // Assuming time format is compatible
    status: ssBooking.status || 'confirmed', // Map SuperSaaS status or default
    supersaas_booking_id: ssBooking.id, // Store original ID for reference
    payment_status: 'pending', // Default to pending, will be updated by Paystack flow
  };
}

// Function to insert bookings into Supabase
async function insertBookingsIntoSupabase(bookings) {
  console.log(`Attempting to insert ${bookings.length} bookings into Supabase...`);
  let insertedCount = 0;
  let skippedCount = 0;

  for (const booking of bookings) {
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([booking]);

      if (error) {
        console.error(`Error inserting booking ${booking.supersaas_booking_id}:`, error.message);
        skippedCount++;
      } else {
        insertedCount++;
      }
    } catch (error) {
      console.error(`Unexpected error inserting booking ${booking.supersaas_booking_id}:`, error.message);
      skippedCount++;
    }
  }

  console.log(`Migration complete. Inserted: ${insertedCount}, Skipped: ${skippedCount}`);
}

// --- Main Migration Logic ---
async function migrate() {
  try {
    const superSaasBookings = await fetchSuperSaasBookings();
    
    if (!superSaasBookings || superSaasBookings.length === 0) {
      console.log('No bookings found in SuperSaaS to migrate.');
      return;
    }

    const supabaseBookings = [];
    for (const ssBooking of superSaasBookings) {
      const supabaseBooking = await transformBooking(ssBooking);
      if (supabaseBooking) {
        supabaseBookings.push(supabaseBooking);
      }
    }

    if (supabaseBookings.length > 0) {
      await insertBookingsIntoSupabase(supabaseBookings);
    } else {
      console.log('No valid bookings found after transformation to insert into Supabase.');
    }

  } catch (error) {
    console.error('Migration process failed:', error.message);
  }
}

// --- Execute Migration ---
// To run this script:
// 1. Make sure you have Node.js installed.
// 2. Install dependencies: npm install axios @supabase/supabase-js
// 3. Set your environment variables:
//    export NEXT_PUBLIC_SUPABASE_URL='YOUR_SUPABASE_URL'
//    export NEXT_PUBLIC_SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY'
//    export SUPERSAAS_API_KEY='YOUR_SUPERSAAS_API_KEY'
// 4. Run the script: node scripts/supersaas_migration.js

// For now, we'll just call migrate. In a real scenario, you might want to add command-line arguments
// to control the process (e.g., --dry-run, --limit).
migrate();
