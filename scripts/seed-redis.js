require('dotenv').config({ path: '/home/user/appointmentbooking/.env.development.local' });
const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
const { createClient: createRedisClient } = require('redis');

async function seedRedisFromSupabase() {
  // 1. Connect to Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Service Role Key is not defined in your environment variables.');
    process.exit(1);
  }

  const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

  // 2. Fetch salon data
  const { data: salons, error } = await supabase
    .from('salons')
    .select('id, custom_domain');

  if (error) {
    console.error('Error fetching salons from Supabase:', error);
    process.exit(1);
  }

  if (!salons || salons.length === 0) {
    console.log('No salons found in Supabase. Nothing to seed.');
    return;
  }

  // 3. Connect to Redis
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.error('REDIS_URL is not defined in your environment variables.');
    process.exit(1);
  }

  const redisClient = createRedisClient({ url: redisUrl });
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();

  console.log(`Found ${salons.length} salons to seed into Redis.`);

  // 4. Populate Redis
  for (const salon of salons) {
    if (salon.custom_domain && salon.id) {
      console.log(`Setting in Redis: ${salon.custom_domain} -> ${salon.id}`);
      await redisClient.set(salon.custom_domain, salon.id);
    }
  }

  // 5. Disconnect
  await redisClient.disconnect();
  console.log('✅ Redis seeding complete.');
}

seedRedisFromSupabase();
