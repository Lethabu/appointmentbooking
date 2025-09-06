const axios = require('axios');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function verifyDeployment() {
  console.log('🔍 Verifying InStyle E-Commerce Deployment');
  console.log('==========================================');

  const tests = [
    {
      name: 'Home Page',
      url: `${BASE_URL}/instylehairboutique`,
      expected: 'InStyle Hair Boutique'
    },
    {
      name: 'Shop Page',
      url: `${BASE_URL}/instylehairboutique/shop`,
      expected: 'Shop Products'
    },
    {
      name: 'API Health',
      url: `${BASE_URL}/api/health`,
      expected: 'ok'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n🧪 Testing: ${test.name}`);
      const response = await axios.get(test.url, { timeout: 10000 });
      
      if (response.status === 200 && response.data.includes?.(test.expected)) {
        console.log(`✅ PASS: ${test.name}`);
        passed++;
      } else {
        console.log(`❌ FAIL: ${test.name} - Unexpected response`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ FAIL: ${test.name} - ${error.message}`);
      failed++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! InStyle E-Commerce is ready for production.');
    console.log('\n🌐 Live URLs:');
    console.log(`   - Home: ${BASE_URL}/instylehairboutique`);
    console.log(`   - Shop: ${BASE_URL}/instylehairboutique/shop`);
    console.log(`   - Book: ${BASE_URL}/book/instylehairboutique`);
  } else {
    console.log('\n⚠️ Some tests failed. Please check the deployment.');
    process.exit(1);
  }
}

// Manual verification checklist
function printManualChecklist() {
  console.log('\n📋 Manual Verification Checklist:');
  console.log('==================================');
  console.log('□ Home page loads with InStyle branding');
  console.log('□ Shop page displays 5 products');
  console.log('□ Add to cart functionality works');
  console.log('□ Cart persists across page refreshes');
  console.log('□ PayStack checkout flow completes');
  console.log('□ Success page clears cart');
  console.log('□ Mobile responsive design');
  console.log('□ AI chat responds correctly');
  console.log('□ WhatsApp bot configuration uploaded');
  console.log('□ Social media links work');
  console.log('\n🚀 Production Readiness:');
  console.log('□ SSL certificate configured');
  console.log('□ Domain DNS pointing correctly');
  console.log('□ PayStack live keys configured');
  console.log('□ WhatsApp Business API connected');
  console.log('□ Analytics tracking enabled');
}

if (require.main === module) {
  verifyDeployment().then(() => {
    printManualChecklist();
  });
}

module.exports = { verifyDeployment };