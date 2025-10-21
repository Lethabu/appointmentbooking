#!/usr/bin/env node
/**
 * Instyle SuperSaaS Sync - Minimal Implementation
 * 1. Pull bookings from SuperSaaS → Supabase
 * 2. Push new Supabase bookings → SuperSaaS
 * Usage: node scripts/instyle-supersaas-sync.js
 */

import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SALON_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
const SSA_KEY = 'lY4rIwV0BfgGin_KvxdUdQ';
const SSA_SCHEDULE = 'Instyle_Hair_Boutique';

// Pull from SuperSaaS
async function pullBookings() {
  const { data } = await axios.get('https://www.supersaas.com/api/bookings.json', {
    params: { schedule_id: SSA_SCHEDULE },
    auth: { username: SSA_KEY, password: 'x' }
  });
  
  for (const booking of data) {
    await supabase.from('appointments').upsert({
      salon_id: SALON_ID,
      full_name: booking.full_name,
      email: booking.email,
      phone: booking.phone,
      scheduled_time: booking.start,
      supersaas_id: booking.id
    }, { onConflict: 'supersaas_id' });
  }
  console.log(`✅ Synced ${data.length} bookings from SuperSaaS`);
}

// Push to SuperSaaS
async function pushBookings() {
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', SALON_ID)
    .is('supersaas_id', null);

  for (const appt of data) {
    const { data: ssBooking } = await axios.post(
      'https://www.supersaas.com/api/bookings.json',
      {
        schedule_id: SSA_SCHEDULE,
        full_name: appt.full_name,
        email: appt.email,
        phone: appt.phone,
        start: appt.scheduled_time
      },
      { auth: { username: SSA_KEY, password: 'x' } }
    );

    await supabase
      .from('appointments')
      .update({ supersaas_id: ssBooking.id })
      .eq('id', appt.id);
  }
  console.log(`✅ Pushed ${data.length} bookings to SuperSaaS`);
}

// Run sync
(async () => {
  await pullBookings();
  await pushBookings();
})();