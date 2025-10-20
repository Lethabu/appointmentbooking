#!/bin/bash

# Setup Vercel Environment Variables for Redis
# Replace the values with your actual Redis connection details from Vercel dashboard

echo "Setting up Vercel environment variables..."

# Set Redis URL (if using standard Redis)
# vercel env add REDIS_URL production

# Set Upstash Redis REST URL and Token (most common for Vercel)
# vercel env add UPSTASH_REDIS_REST_URL production
# vercel env add UPSTASH_REDIS_REST_TOKEN production

echo "Uncomment and run the commands above with your actual Redis values"
echo "Get these values from: Vercel Dashboard → Your Project → Storage → Redis"