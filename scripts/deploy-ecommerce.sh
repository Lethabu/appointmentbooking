#!/bin/bash

echo "🛍️ InStyle Hair Boutique - E-Commerce Deployment"
echo "================================================"

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install zustand nanoid

# Step 2: Build knowledge base
echo "🧠 Building AI knowledge base..."
node scripts/build-kb.js

# Step 3: Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Step 4: Migrate products
echo "🛍️ Migrating products..."
node scripts/migrate-products.js

# Step 5: Migrate SuperSaaS data
echo "🔄 Migrating SuperSaaS data..."
node scripts/migrate-supersaas.js

# Step 6: Build application
echo "🏗️ Building application..."
npm run build

# Step 7: Start application
echo "🌟 Starting InStyle E-Commerce..."
npm start

echo "✅ E-Commerce deployment completed!"
echo ""
echo "🌐 InStyle Hair Boutique E-Commerce is now live:"
echo "   - Main Site: https://instylehairboutique.co.za"
echo "   - Shop: https://instylehairboutique.co.za/shop"
echo "   - Booking: https://instylehairboutique.co.za/book/instylehairboutique"
echo ""
echo "🛍️ Features Available:"
echo "   ✅ Product catalog with cart"
echo "   ✅ PayStack ZAR checkout"
echo "   ✅ WhatsApp chatbot integration"
echo "   ✅ Abandoned cart automation"
echo "   ✅ AI sales assistant"
echo ""
echo "🤖 Chatbot Configuration:"
echo "   - Upload bots/instyle-sales.json to your chatbot platform"
echo "   - Configure WhatsApp webhook endpoints"
echo ""
echo "💳 Payment Setup:"
echo "   - Configure PAYSTACK_SECRET_KEY in environment"
echo "   - Test checkout flow"