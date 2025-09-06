#!/bin/bash

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