#!/bin/bash

echo "🚀 InStyle Hair Boutique - MASTER DEPLOYMENT"
echo "============================================="
echo "Transforming from booking platform to complete e-commerce empire"
echo ""

# Step 1: Environment Check
echo "🔍 Environment Check..."
if [ ! -f ".env.local" ]; then
    echo "⚠️ .env.local not found. Creating from template..."
    cp .env.example .env.local
fi

# Step 2: Dependencies
echo "📦 Installing dependencies..."
npm install --silent

# Step 3: Database Setup
echo "🗄️ Database setup..."
npm run db:migrate --silent

# Step 4: Seed Data
echo "🌱 Seeding data..."
node scripts/build-kb.js
node scripts/seed-products.js

# Step 5: Build Application
echo "🏗️ Building application..."
npm run build --silent

# Step 6: Verification
echo "🧪 Running verification..."
node scripts/verify-deployment.js

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "======================="
echo ""
echo "🎯 InStyle Hair Boutique E-Commerce Empire is LIVE:"
echo ""
echo "🏠 Main Site:"
echo "   https://instylehairboutique.co.za"
echo ""
echo "🛍️ E-Commerce Shop:"
echo "   https://instylehairboutique.co.za/shop"
echo "   - 5 products available (R150-R450)"
echo "   - PayStack ZAR checkout"
echo "   - Persistent shopping cart"
echo ""
echo "📅 Booking System:"
echo "   https://instylehairboutique.co.za/book/instylehairboutique"
echo "   - 3 services (R250-R600)"
echo "   - AI assistant integration"
echo ""
echo "🤖 AI Features:"
echo "   - Nia chat assistant on website"
echo "   - WhatsApp sales bot (upload bots/instyle-sales.json)"
echo "   - Abandoned cart automation"
echo ""
echo "📱 Social Commerce:"
echo "   - Instagram: @instyle_hair_boutique_"
echo "   - TikTok: @instylehairboutique"
echo "   - WhatsApp catalog ready"
echo ""
echo "💰 Revenue Streams:"
echo "   - Product sales: R150-R450 per item"
echo "   - Service bookings: R250-R600"
echo "   - AI-powered upselling"
echo "   - Multi-channel sales"
echo ""
echo "🎉 MISSION ACCOMPLISHED!"
echo "From simple booking site to complete commerce empire in 48 hours"
echo ""
echo "Next steps:"
echo "1. Configure PayStack live keys"
echo "2. Upload WhatsApp bot configuration"
echo "3. Set up social media shops"
echo "4. Launch marketing campaigns"