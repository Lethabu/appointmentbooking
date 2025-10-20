/**
 * supersaas_migration.js
 * 1. Pull every booking from SuperSaaS
 * 2. Upsert into Supabase
 * 3. Idempotent (safe to re-run)
 * Run:  node scripts/supersaas_migration.js
 */
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SALON_ID = process.env.INSTYLE_SALON_ID;
const SSA_KEY = process.env.SUPERSAAS_API_KEY;
const SSA_SCHEDULE = process.env.SUPERSAAS_SCHEDULE_ID;
const SSA_ACCOUNT_NAME = process.env.SUPERSAAS_ACCOUNT_NAME;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const baseUrl = 'https://www.supersaas.com/api';

/**
 * Fetch all bookings from SuperSaaS
 */
async function fetchBookings() {
  const res = await axios.get(`${baseUrl}/bookings.json`, {
    params: { schedule_id: SSA_SCHEDULE, limit: 5000 },
    auth: { username: SSA_ACCOUNT_NAME, password: SSA_KEY },
  });
  return res.data;
}

/**
 * Map SuperSaaS -> Supabase
 */
function map(booking) {
  const serviceMap = {
    'Middle & Side Installation': 'Middle & Side Installation',
    'Maphondo & Lines Installation': 'Maphondo & Lines Installation',
  };
  return {
    salon_id: SALON_ID,
    full_name: booking.full_name || booking.name,
    email: booking.email,
    phone: booking.phone,
    service_name: serviceMap[booking.description] || 'Hair Treatment',
    scheduled_time: new Date(booking.start).toISOString(),
    status: 'confirmed',
    supersaas_id: booking.id,        // for idempotency
  };
}

/**
 * Upsert into Supabase
 */
async function upsertBookings(bookings) {
  for (const b of bookings) {
    const row = map(b);
    await supabase
      .from('appointments')
      .upsert(row, { onConflict: 'supersaas_id' });
  }
}

/**
 * Main
 */
(async () => {
  console.log('🔍 Fetching SuperSaaS bookings...');
  const bookings = await fetchBookings();
  console.log(`📥 Found ${bookings.length} bookings`);
  await upsertBookings(bookings);
  console.log('✅ Migration complete');
})();
