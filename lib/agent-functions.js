// lib/agent-functions.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper: get available appointments
 * @param {string} salonId - The ID of the salon.
 * @param {object} options
 * @param {string} options.service_id - The ID of the service to check for appointments.
 * @param {string} [options.date] - The date to check for appointments, in YYYY-MM-DD format. Defaults to today if not provided.
 * @returns {Promise<object>} - An object containing available slots or an error.
 */
export async function getAvailableAppointments(salonId, { service_id, date }) {
  console.log(`getAvailableAppointments called for salon ${salonId}, service ${service_id}, date ${date}`);
  // TODO: Implement actual availability logic, considering:
  // - Salon's working hours
  // - Service duration
  // - Staff availability
  // - Existing bookings
  // - Buffer times
  // For now, return mock data
  const mockSlots = [
    "2025-07-15T09:00:00Z",
    "2025-07-15T10:00:00Z",
    "2025-07-15T11:00:00Z",
  ];
  return { available_slots: mockSlots };
}

/**
 * Helper: book appointment
 * @param {string} salonId - The ID of the salon.
 * @param {object} options
 * @param {string} options.service_id - The ID of the service for the appointment.
 * @param {string} options.datetime - The specific date and time for the appointment in ISO 8601 format.
 * @param {string} options.client_name - The full name of the client.
 * @param {string} [options.client_phone] - The phone number of the client.
 * @returns {Promise<object>} - An object containing the booked appointment details or an error.
 */
export async function bookAppointment(salonId, { service_id, datetime, client_name, client_phone }) {
  console.log(`bookAppointment called for salon ${salonId}, service ${service_id}, datetime ${datetime}, client ${client_name}`);

  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          salon_id: salonId,
          service_id: service_id,
          start_time: datetime,
          client_name: client_name,
          client_phone: client_phone,
          status: 'pending', // Or 'confirmed' based on salon settings
          // tenant_id will be automatically handled by RLS if the user is authenticated
        },
      ])
      .select();

    if (error) {
      console.error('Booking error:', error);
      return { error: error.message || 'Booking failed' };
    }

    // Trigger webhook for confirmation (if needed)
    // const webhookRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/booking-confirmed`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ appointment_id: data[0].id }),
    // });

    // if (!webhookRes.ok) {
    //   const webhookError = await webhookRes.text();
    //   console.error('Webhook failed:', webhookError);
    //   return { error: `Booking saved, but confirmation webhook failed: ${webhookError}` };
    // }

    return { success: true, appointment: data[0] };
  } catch (e) {
    console.error('Booking exception:', e);
    return { error: 'Booking saved, but confirmation webhook threw an exception.' };
  }
}

/**
 * Helper: search products (placeholder)
 * @param {string} salonId - The ID of the salon.
 * @param {string} query - The search query.
 * @returns {Promise<object>} - An object containing search results or an error.
 */
export async function searchProducts(salonId, query) {
  console.log(`searchProducts called for salon ${salonId}, query ${query}`);
  // TODO: Implement actual product search logic
  return { products: [] };
}
