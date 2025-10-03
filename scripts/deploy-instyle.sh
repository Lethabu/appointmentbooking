#!/bin/bash

<<<<<<< HEAD
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
=======
echo "🚀 InStyle Hair Boutique - Deployment Script"
echo "============================================="

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build knowledge base
echo "🧠 Building AI knowledge base..."
node scripts/build-kb.js

# Step 3: Extract SuperSaaS data
echo "📊 Extracting SuperSaaS data..."
node scripts/supersaas-extract.js

# Step 4: Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Step 5: Migrate SuperSaaS data
echo "🔄 Migrating SuperSaaS data..."
node scripts/migrate-supersaas.js

# Step 6: Build application
echo "🏗️ Building application..."
npm run build

# Step 7: Start application
echo "🌟 Starting InStyle Hair Boutique..."
npm start

echo "✅ Deployment completed!"
echo "🌐 InStyle Hair Boutique is now live at:"
echo "   - https://instylehairboutique.co.za"
echo "   - https://appointmentbooking.co.za/instylehairboutique"
>>>>>>> origin/feat/instyle-whitelabel
