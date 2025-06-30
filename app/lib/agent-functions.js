import { createClient } from '@supabase/supabase-js';

// Helper: get available appointments
export async function getAvailableAppointments(salonId, { service_id, date }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  // Simplified availability - in production use calendar integration
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    slots.push(`${String(hour).padStart(2, '0')}:30`);
  }
  return { available_slots: slots };
}

// Helper: book appointment
export async function bookAppointment(salonId, { service_id, datetime, client_name, client_phone }) {
  if (!service_id || !datetime || !client_name) {
    return { error: 'Missing required fields: service_id, datetime, and client_name are required.' };
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      salon_id: salonId,
      service_id,
      start_time: datetime,
      client_name,
      client_phone,
      status: 'confirmed'
    })
    .select();
  if (error) {
    console.error('Booking error:', error);
    return { error: error.message || 'Booking failed' };
  }
  // Trigger confirmation webhook and check response
  try {
    const webhookRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/booking-confirmed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment_id: data[0].id })
    });
    if (!webhookRes.ok) {
      const webhookError = await webhookRes.text();
      console.error('Webhook failed:', webhookError);
      return {
        error: `Booking saved, but confirmation webhook failed: ${webhookError}`
      };
    }
  } catch (err) {
    console.error('Webhook exception:', err);
    return { error: 'Booking saved, but confirmation webhook threw an exception.' };
  }
  return {
    success: true,
    confirmation: `Booked for ${new Date(datetime).toLocaleString()}`
  };
}

// Helper: search products
export async function searchProducts(salonId, query) {
  if (!query) {
    return [];
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, description')
    .eq('salon_id', salonId)
    .ilike('name', `%${query}%`)
    .limit(5);
  if (error) {
    console.error('Product search error:', error);
    return [];
  }
  return data || [];
}
