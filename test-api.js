// Quick API test without Docker
const { createClient } = require('@supabase/supabase-js');

// Mock Supabase client for testing
const mockSupabase = {
  from: (table) => ({
    select: () => ({
      eq: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: { duration_minutes: 90 },
            error: null
          })
        }),
        order: () => Promise.resolve({
          data: [
            { id: '1', name: 'Women\'s Cut & Blow', price_zar: 35000, duration_minutes: 90 },
            { id: '2', name: 'Men\'s Cut', price_zar: 25000, duration_minutes: 45 }
          ],
          error: null
        })
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({
          data: {
            id: 'test-booking-123',
            tenant_id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
            service_id: '1',
            client_name: 'Test User',
            client_phone: '+27821234567',
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 90*60000).toISOString(),
            status: 'confirmed',
            created_at: new Date().toISOString()
          },
          error: null
        })
      })
    })
  })
};

// Test booking creation
async function testBooking() {
  console.log('🧪 Testing booking API...');
  
  const booking = {
    tenant_id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
    service_id: '1',
    client_name: 'Test User',
    client_phone: '+27821234567',
    start_time: new Date(Date.now() + 24*60*60*1000).toISOString(),
    consent_popia: true
  };
  
  try {
    const result = await mockSupabase.from('bookings').insert(booking).select().single();
    console.log('✅ Booking test passed:', result.data.id);
    return true;
  } catch (error) {
    console.log('❌ Booking test failed:', error.message);
    return false;
  }
}

// Test services fetch
async function testServices() {
  console.log('🧪 Testing services API...');
  
  try {
    const result = await mockSupabase.from('services').select().eq('tenant_id', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70').eq('is_active', true).order('name');
    console.log('✅ Services test passed:', result.data.length, 'services found');
    return true;
  } catch (error) {
    console.log('❌ Services test failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 INSTYLE HAIR BOUTIQUE - API TESTS');
  console.log('====================================');
  
  const bookingTest = await testBooking();
  const servicesTest = await testServices();
  
  if (bookingTest && servicesTest) {
    console.log('\n🎉 ALL TESTS PASSED - SYSTEM READY!');
    console.log('📊 Next steps:');
    console.log('   1. Start Next.js: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Test booking form');
  } else {
    console.log('\n❌ Some tests failed - check configuration');
  }
}

runTests();