const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const salonId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'; // InStyle Hair Boutique Salon ID

async function seed() {
  try {
    // Seed Services
    const services = [
      { name: 'Middle & Side Installation', price_cents: 50000, salon_id: salonId },
      { name: 'Wash & Treat', price_cents: 25000, salon_id: salonId },
    ];
    await supabase.from('services').upsert(services, { onConflict: 'name, salon_id' });

    // Seed Clients
    const clients = [
      { name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', salon_id: salonId },
      { name: 'Bob Williams', email: 'bob@example.com', phone: '234-567-8901', salon_id: salonId },
    ];
    const { data: clientData } = await supabase.from('clients').upsert(clients, { onConflict: 'email, salon_id' }).select();

    // Seed Staff
    const staff = [
      { name: 'Noma', email: 'noma@example.com', salon_id: salonId },
    ];
    const { data: staffData } = await supabase.from('staff').upsert(staff, { onConflict: 'email, salon_id' }).select();

    // Seed Appointments
    const appointments = [
      // Past appointments
      {
        salon_id: salonId,
        client_id: clientData[0].id,
        staff_id: staffData[0].id,
        service_id: services[0].id,
        start_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        end_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        status: 'completed',
      },
      // Upcoming appointments
      {
        salon_id: salonId,
        client_id: clientData[1].id,
        staff_id: staffData[0].id,
        service_id: services[1].id,
        start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
      },
    ];
    await supabase.from('appointments').upsert(appointments);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seed();