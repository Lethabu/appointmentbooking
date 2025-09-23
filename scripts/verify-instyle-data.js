#!/usr/bin/env node

const axios = require('axios');

async function verifyInstyleData() {
  const socials = {
    instagram: 'https://www.instagram.com/instyle_hair_boutique_/',
    facebook:
      'https://www.facebook.com/people/Instyle-Hair-Boutique/100063693825008/',
    tiktok: 'https://www.tiktok.com/@instyle.hair.studio?lang=en',
    google: 'https://g.co/kgs/VSzBnDe',
  };

  console.log('🔍 Verifying InStyle Hair Boutique data alignment...\n');

  // Check social links
  for (const [platform, url] of Object.entries(socials)) {
    try {
      const response = await axios.head(url, { timeout: 5000 });
      console.log(`✅ ${platform}: ${url} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${platform}: ${url} - Error: ${error.message}`);
    }
  }

  console.log('\n📍 Contact Information:');
  console.log('Address: Soshanguve, Pretoria, South Africa');
  console.log('Phone: +27123456789');
  console.log('Email: bookings@instylehairboutique.co.za');
  console.log('WhatsApp: +27123456789');

  console.log('\n✅ Data verification complete');
}

if (require.main === module) {
  verifyInstyleData();
}

module.exports = { verifyInstyleData };
