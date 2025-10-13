// test-connection.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://awrnkvjitzwzojaonrzo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cm5rdmppdHp3em9qYW9ucnpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDMzMDM4NCwiZXhwIjoyMDY1OTA2Mzg0fQ._X6Ukz5cJ3GxxZGcJq3mmmOP9egBz65QIZN0016X3p4'
);

async function test() {
  try {
    const { data, error } = await supabase.from('tenants').select('*').limit(1);
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Success! Found tenants:', data);
    }
  } catch (e) {
    console.log('Connection error:', e.message);
  }
}

test();