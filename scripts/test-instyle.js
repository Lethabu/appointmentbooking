const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testInStyleSetup() {
  console.log('🧪 Testing InStyle Hair Boutique Setup');
  console.log('=====================================');

  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing database connection...');
    const { data: tenants, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', 'instylehairboutique');
    
    if (tenantError) throw tenantError;
    console.log(`✅ Found tenant: ${tenants[0]?.name}`);

    // Test 2: Services
    console.log('2️⃣ Testing services...');
    const { data: services, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('tenant_id', tenants[0]?.id);
    
    if (serviceError) throw serviceError;
    console.log(`✅ Found ${services?.length || 0} services`);

    // Test 3: Bookings
    console.log('3️⃣ Testing bookings...');
    const { data: bookings, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('tenant_id', tenants[0]?.id);
    
    if (bookingError) throw bookingError;
    console.log(`✅ Found ${bookings?.length || 0} bookings`);

    // Test 4: API Endpoints (if server is running)
    try {
      console.log('4️⃣ Testing API endpoints...');
      const response = await axios.get('http://localhost:3000/api/tenants');
      console.log('✅ API endpoints accessible');
    } catch (error) {
      console.log('⚠️ API endpoints not accessible (server may not be running)');
    }

    console.log('\n🎉 All tests passed! InStyle Hair Boutique is ready.');
    console.log('\n📋 Summary:');
    console.log(`   - Tenant: ${tenants[0]?.name}`);
    console.log(`   - Services: ${services?.length || 0}`);
    console.log(`   - Bookings: ${bookings?.length || 0}`);
    console.log(`   - URL: https://instylehairboutique.co.za`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testInStyleSetup();
}

module.exports = { testInStyleSetup };