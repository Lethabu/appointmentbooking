// Test Redis connection
const { Redis } = require('@upstash/redis');

async function testRedis() {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.log('❌ Redis environment variables not set');
      return;
    }

    const redis = Redis.fromEnv();
    
    // Test connection
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    
    if (value === 'test-value') {
      console.log('✅ Redis connection successful');
      await redis.del('test-key');
    } else {
      console.log('❌ Redis test failed');
    }
  } catch (error) {
    console.log('❌ Redis connection failed:', error.message);
  }
}

testRedis();