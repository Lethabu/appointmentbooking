const { createClient } = require('@supabase/supabase-js');
const { extractSuperSaaSData } = require('./supersaas-extract');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const INSTYLE_TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

async function migrateSuperSaaSData() {
  try {
    console.log('🚀 Starting SuperSaaS migration...');
    
    // Extract data from SuperSaaS
    const { bookings, schedules } = await extractSuperSaaSData();
    
    // Create tenant if not exists
    const { data: tenant } = await supabase
      .from('tenants')
      .upsert({
        id: INSTYLE_TENANT_ID,
        name: 'InStyle Hair Boutique',
        slug: 'instylehairboutique',
        subdomain: 'instylehairboutique',
        brand: {
          primary: '#8b5cf6',
          secondary: '#f59e0b',
          logo: '/tenants/instyle/logo.png'
        }
      }, { onConflict: 'id' })
      .select()
      .single();

    console.log('✅ Tenant created/updated');

    // Migrate services from schedules
    const services = schedules.map(schedule => ({
      tenant_id: INSTYLE_TENANT_ID,
      name: schedule.name || 'Hair Service',
      duration_min: schedule.slot_length || 60,
      price_cents: (schedule.price || 0) * 100,
      category: 'Hair',
      supersaas_id: schedule.id.toString(),
      description: schedule.description || ''
    }));

    const { data: serviceData } = await supabase
      .from('services')
      .upsert(services, { onConflict: 'supersaas_id' })
      .select();

    console.log(`✅ Migrated ${serviceData?.length || 0} services`);

    // Migrate bookings
    const bookingData = bookings
      .filter(booking => booking.full_name && booking.phone)
      .map(booking => ({
        tenant_id: INSTYLE_TENANT_ID,
        client_name: booking.full_name,
        client_phone: booking.phone || booking.email || 'N/A',
        service_id: serviceData?.[0]?.id || null, // Default to first service
        start_at: new Date(booking.start).toISOString(),
        status: booking.status || 'confirmed',
        supersaas_id: booking.id.toString()
      }))
      .filter(booking => booking.service_id);

    if (bookingData.length > 0) {
      const { data: bookings } = await supabase
        .from('bookings')
        .upsert(bookingData, { onConflict: 'supersaas_id' })
        .select();

      console.log(`✅ Migrated ${bookings?.length || 0} bookings`);
    }

    console.log('🎉 SuperSaaS migration completed successfully!');
    
    return {
      tenant,
      services: serviceData,
      bookings: bookingData
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

if (require.main === module) {
  migrateSuperSaaSData();
}

module.exports = { migrateSuperSaaSData };