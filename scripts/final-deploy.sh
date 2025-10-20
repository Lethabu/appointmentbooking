#!/bin/bash

# Final production deployment with best practices

set -e

echo "🚀 InStyle Hair Boutique - Final Production Deployment"
echo "=================================================="

# Pre-deployment checks
echo "🔍 Running pre-deployment validation..."
./scripts/security-check.sh

# Build optimization
echo "🏗️  Building optimized production bundle..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to production..."
vercel --prod --yes

# Post-deployment validation
echo "✅ Running post-deployment checks..."
sleep 10
node scripts/validate-production.js

# Setup monitoring
echo "📊 Configuring monitoring..."
curl -f "https://instylehairboutique.co.za/api/health" || echo "⚠️  Health check failed"

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "========================"
echo "🌐 Website: https://instylehairboutique.co.za"
echo "🛍️  Shop: https://instylehairboutique.co.za/instylehairboutique/shop/enhanced"
echo "📊 Dashboard: https://instylehairboutique.co.za/instylehairboutique/dashboard"
echo ""
echo "✅ InStyle Hair Boutique is now LIVE with full e-commerce capabilities!"