#!/bin/bash
# scripts/deploy-tenant-wrapper.sh

set -e

echo "🚀 DEPLOYING TENANT-WRAPPER APPLICATION"
echo "======================================"

# Ensure we're in tenant-wrapper directory
cd /home/user/appointmentbooking/tenant-wrapper

# Install dependencies
npm install next react react-dom typescript @types/react @types/node

# Create necessary directories
mkdir -p app/api/bookings
mkdir -p components
mkdir -p public/logos

# Deploy to Vercel
vercel --prod --yes

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls | head -2 | tail -1 | awk '{print $2}')
echo "Deployment URL: $DEPLOYMENT_URL"

# Test tenant isolation
echo -e "
🧪 TESTING TENANT ISOLATION:"
echo "Testing homepage:"
curl -s -H "Host: www.instylehairboutique.co.za" "$DEPLOYMENT_URL" | head -20

echo -e "
Testing booking page:"
curl -s -H "Host: www.instylehairboutique.co.za" "$DEPLOYMENT_URL/book" | head -20

echo -e "
✅ DEPLOYMENT COMPLETE"
echo "Test URLs:"
echo "- Homepage: https://www.instylehairboutique.co.za"
echo "- Booking: https://www.instylehairboutique.co.za/book"
