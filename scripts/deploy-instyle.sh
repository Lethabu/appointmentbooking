#!/bin/bash

echo "🚀 Deploying InStyle Hair Boutique..."

# 1. Extract SuperSaaS data
echo "📥 Extracting SuperSaaS data..."
node scripts/supersaas-extract.js

# 2. Build knowledge base
echo "🧠 Building AI knowledge base..."
node scripts/build-kb.js

# 3. Sync social media
echo "📱 Syncing social media..."
curl -X POST http://localhost:3000/api/social-sync \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"ccb12b4d-ade6-467d-a614-7c9d198ddc70"}'

# 4. Build and start
echo "🔨 Building application..."
npm run build

echo "✅ InStyle Hair Boutique deployed successfully!"
echo "🌐 Visit: https://instylehairboutique.co.za"