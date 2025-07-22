import { createClient } from '@supabase/supabase-js';

// This script will handle the migration of data from SuperSaaS to Supabase.

async function fetchSuperSaaSData() {
  const apiKey = 'IyPY-A-EHZ3PDKRCJzu54Q';
  // Note: The schedule_id is a placeholder and needs to be replaced with the actual schedule ID from your SuperSaaS account.
  const scheduleId = '12345';
  const url = `https://www.supersaas.com/api/bookings.json?schedule_id=${scheduleId}&api_key=${apiKey}`;

  console.log('Fetching data from SuperSaaS...');

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Successfully fetched data from SuperSaaS.');
    return data;
  } catch (error) {
    console.error('Error fetching data from SuperSaaS:', error);
    return null;
  }
}

async function mapDataToSupabaseSchema(supersaasData) {
  if (!supersaasData) {
    console.log('No data from SuperSaaS to map.');
    return [];
  }

  console.log('Mapping data to Supabase schema...');

  // This is a placeholder. Replace with the actual salon_id for your tenant.
  const salonId = '67890';

  const mappedData = supersaasData.map(booking => {
    // TODO: Resolve SuperSaaS user/service/staff IDs to Supabase UUIDs.
    // This will likely require querying your Supabase tables.
    const clientId = null; // Placeholder for resolved Supabase client UUID
    const serviceId = null; // Placeholder for resolved Supabase service UUID
    const staffId = null; // Placeholder for resolved Supabase staff UUID

    return {
      salon_id: salonId,
      client_id: clientId,
      service_id: serviceId,
      staff_id: staffId,
      start_time: booking.start, // Assuming 'start' field in SuperSaaS data
      end_time: booking.finish, // Assuming 'finish' field in SuperSaaS data
      status: 'completed', // Or map from SuperSaaS status if available
      created_at: booking.created_on, // Assuming 'created_on' field
    };
  });

  console.log('Data mapping complete.');
  return mappedData;
}

async function importDataIntoSupabase(mappedData) {
  if (!mappedData || mappedData.length === 0) {
    console.log('No mapped data to import.');
    return;
  }

  console.log('Importing data into Supabase...');

  // It's recommended to use a service role key for admin-level operations like this migration.
  // This should be stored securely in your environment variables.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Ensure this is set in your .env.local

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or Service Key is not defined. Please check your .env.local file.');
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .insert(mappedData);

  if (error) {
    console.error('Error importing data into Supabase:', error);
  } else {
    console.log('Successfully imported data into Supabase:', data);
  }
}

async function runMigration() {
  const supersaasData = await fetchSuperSaaSData();
  const mappedData = await mapDataToSupabaseSchema(supersaasData);
  await importDataIntoSupabase(mappedData);
}

runMigration();