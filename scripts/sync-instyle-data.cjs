const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const INSTYLE_TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

// Real client data from CSV analysis
const topClients = [
  { name: 'Zanele Langa', email: 'Zanelelanga46@gmail.com', phone: '0647696159', visits: 12 },
  { name: 'Rapelang', email: 'rapelangraps50@gmail.com', phone: '0659480352', visits: 8 },
  { name: 'Keatlaretse Makapela', email: 'kmakapelakea@gmail.com', phone: '0742298792', visits: 7 },
  { name: 'Rejoyce Hlongwane', email: 'rejoycehlongwane@gmail.com', phone: '0795656023', visits: 6 },
  { name: 'Yolanda', email: 'Kamfede@gmail.com', phone: '0735628139', visits: 5 },
  { name: 'Senzeni Marcia', email: 'marciasenzeni@gmail.com', phone: '0810950971', visits: 4 },
  { name: 'Dimakatso', email: 'dimakatsomangwane7@gmail.com', phone: '0695400654', visits: 4 },
  { name: 'Vanessa Ramogale', email: 'vanessaholerato1@gmail.com', phone: '0760281561', visits: 4 },
  { name: 'Sibongile', email: 'Sibongileb33@gmail.com', phone: '0767441094', visits: 3 },
  { name: 'Kopano Motsepe', email: 'ratikopano6@gmail.com', phone: '0715138920', visits: 3 }
];

const services = [
  {
    name: 'Middle & Side Installation',
    description: 'Professional hair installation with middle part and side styling',
    price: 150000, // R1500 in cents
    duration: 60,
    category: 'Installation'
  },
  {
    name: 'Maphondo & Lines Installation', 
    description: 'Traditional Maphondo style with clean lines',
    price: 150000, // R1500 in cents
    duration: 60,
    category: 'Installation'
  }
];

async function syncInstyleData() {
  console.log('🚀 Starting Instyle data synchronization...');

  try {
    // 1. Ensure tenant exists
    console.log('📋 Setting up tenant...');
    const { error: tenantError } = await supabase
      .from('tenants')
      .upsert({
        id: INSTYLE_TENANT_ID,
        name: 'Instyle Hair Boutique',
        domain: 'instylehairboutique.co.za',
        branding: {
          primary_color: '#D4A574',
          secondary_color: '#2C2C2C',
          accent_color: '#F5F5F5',
          business_name: 'Instyle Hair Boutique',
          tagline: 'Professional Hair Installation & Styling'
        }
      });

    if (tenantError) throw tenantError;

    // 2. Sync services
    console.log('💇‍♀️ Syncing services...');
    for (const service of services) {
      const { error: serviceError } = await supabase
        .from('services')
        .upsert({
          tenant_id: INSTYLE_TENANT_ID,
          ...service
        });
      
      if (serviceError) throw serviceError;
    }

    // 3. Sync top clients
    console.log('👥 Syncing client data...');
    for (const client of topClients) {
      const { error: clientError } = await supabase
        .from('customers')
        .upsert({
          tenant_id: INSTYLE_TENANT_ID,
          name: client.name,
          email: client.email,
          phone: client.phone,
          notes: `Frequent client - ${client.visits} visits`
        }, {
          onConflict: 'tenant_id,email'
        });
      
      if (clientError) throw clientError;
    }

    // 4. Create sample appointments for this week
    console.log('📅 Creating sample appointments...');
    const { data: customers } = await supabase
      .from('customers')
      .select('id, name')
      .eq('tenant_id', INSTYLE_TENANT_ID)
      .limit(5);

    const { data: serviceData } = await supabase
      .from('services')
      .select('id, name')
      .eq('tenant_id', INSTYLE_TENANT_ID);

    if (customers && serviceData) {
      const appointments = [];
      const today = new Date();
      
      for (let i = 0; i < 10; i++) {
        const appointmentDate = new Date(today);
        appointmentDate.setDate(today.getDate() + (i % 7));
        
        const customer = customers[i % customers.length];
        const service = serviceData[i % serviceData.length];
        const hour = 9 + (i % 8); // 9 AM to 4 PM
        
        appointments.push({
          tenant_id: INSTYLE_TENANT_ID,
          customer_id: customer.id,
          service_id: service.id,
          appointment_date: appointmentDate.toISOString().split('T')[0],
          start_time: `${hour.toString().padStart(2, '0')}:00`,
          end_time: `${(hour + 1).toString().padStart(2, '0')}:00`,
          status: 'confirmed'
        });
      }

      const { error: appointmentError } = await supabase
        .from('appointments')
        .upsert(appointments);
      
      if (appointmentError) throw appointmentError;
    }

    console.log('✅ Instyle data synchronization completed successfully!');
    console.log(`📊 Synced: ${services.length} services, ${topClients.length} clients, 10 appointments`);

  } catch (error) {
    console.error('❌ Synchronization failed:', error);
    process.exit(1);
  }
}

// Run the sync
if (require.main === module) {
  syncInstyleData();
}

module.exports = { syncInstyleData };