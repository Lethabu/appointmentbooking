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

  const queryDate = date || new Date().toISOString().split('T')[0]; // Default to today

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/availability?salon_id=${salonId}&service_id=${service_id}&date=${queryDate}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching available slots from API:', errorData);
      return { error: errorData.error || 'Failed to fetch available slots' };
    }
    const data = await response.json();
    return { available_slots: data.available_slots };
  } catch (error) {
    console.error('Exception fetching available slots:', error);
    return { error: 'An unexpected error occurred while fetching available slots.' };
  }
}

/**
 * Helper: book appointment
 * @param {string} salonId - The ID of the salon.
 * @param {object} options
 * @param {string} options.service_id - The ID of the service for the appointment.
 * @param {string} options.scheduled_time - The specific date and time for the appointment in ISO 8601 format.
 * @param {string} options.client_name - The full name of the client.
 * @param {string} [options.client_phone] - The phone number of the client.
 * @returns {Promise<object>} - An object containing the booked appointment details or an error.
 */
export async function bookAppointment(salonId, { service_id, scheduled_time, client_name, client_phone, staff_id }) {
  console.log(`bookAppointment called for salon ${salonId}, service ${service_id}, scheduled_time ${scheduled_time}, client ${client_name}`);

  try {
    // 1. Validate availability before booking
    const availabilityResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/availability?salon_id=${salonId}&service_id=${service_id}&date=${scheduled_time.split('T')[0]}`);
    if (!availabilityResponse.ok) {
      const errorData = await availabilityResponse.json();
      return { error: errorData.error || 'Failed to check availability' };
    }
    const availabilityData = await availabilityResponse.json();
    const isSlotAvailable = availabilityData.available_slots.some(slot => new Date(slot).toISOString() === new Date(scheduled_time).toISOString());

    if (!isSlotAvailable) {
      return { error: 'The requested time slot is no longer available. Please choose another.' };
    }

    // 2. Proceed with booking if available
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          salon_id: salonId,
          service_id: service_id,
          scheduled_time: scheduled_time,
          client_name: client_name,
          client_phone: client_phone,
          staff_id: staff_id,
          status: 'pending', // Or 'confirmed' based on salon settings
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
    return { error: 'An unexpected error occurred during booking.' };
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
