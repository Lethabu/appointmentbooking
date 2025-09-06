const axios = require('axios');
const fs = require('fs');

const SUPERSAAS_API_KEY = '5ciPW7IzfQRQy1wqdTsH6g';
const SUPERSAAS_ACCOUNT = 'InStyle_Hair_Boutique';

async function extractSuperSaaSData() {
  try {
    console.log('🔄 Extracting SuperSaaS data...');
    
    // Extract bookings
    const bookingsResponse = await axios.get(
      `https://www.supersaas.com/api/bookings.json?account=${SUPERSAAS_ACCOUNT}&api_key=${SUPERSAAS_API_KEY}`
    );
    
    // Extract services/schedules
    const schedulesResponse = await axios.get(
      `https://www.supersaas.com/api/schedules.json?account=${SUPERSAAS_ACCOUNT}&api_key=${SUPERSAAS_API_KEY}`
    );

    // Create extracted directory
    if (!fs.existsSync('./extracted')) {
      fs.mkdirSync('./extracted');
    }

    // Save data
    fs.writeFileSync('./extracted/supersaas_bookings.json', JSON.stringify(bookingsResponse.data, null, 2));
    fs.writeFileSync('./extracted/supersaas_services.json', JSON.stringify(schedulesResponse.data, null, 2));
    
    console.log('✅ SuperSaaS data extracted successfully');
    console.log(`📊 Found ${bookingsResponse.data.length} bookings`);
    console.log(`🛠️ Found ${schedulesResponse.data.length} schedules`);
    
    return {
      bookings: bookingsResponse.data,
      schedules: schedulesResponse.data
    };
  } catch (error) {
    console.error('❌ Error extracting SuperSaaS data:', error.message);
    throw error;
  }
}

if (require.main === module) {
  extractSuperSaaSData();
}

module.exports = { extractSuperSaaSData };