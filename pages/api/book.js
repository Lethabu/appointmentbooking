import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = createServerSupabaseClient({
    req,
    res,
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const tenant_id = session.user.jwt_claims.tenant_id;
  const { clientDetails, serviceIds } = req.body;

  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        tenant_id,
        client_name: clientDetails.name,
        client_email: clientDetails.email,
        client_phone: clientDetails.phone,
        service_ids: serviceIds, // Assuming service_ids is an array of UUIDs or similar
        // Add other relevant fields like appointment_date, start_time, end_time, etc.
        // These fields would typically come from the frontend request body as well.
      })
      .select();

    if (error) {
      console.error('Error inserting appointment:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Appointment booked successfully', data });
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}