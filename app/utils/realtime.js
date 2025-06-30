// utils/realtime.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl= process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Subscribe to real-time changes for appointments in a salon
export function subscribeToAppointments(salonId, callback) {
  return supabase
    .channel('public:appointments')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `salon_id=eq.${salonId}`,
      },
      payload => {
        callback(payload);
      }
    )
    .subscribe();
}
