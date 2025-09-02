#!/bin/bash

echo "🚀 Deploying AppointmentBooking Platform..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Generate Convex types
echo "🔧 Generating Convex types..."
npm run codegen

# 3. Build the application
echo "🏗️ Building application..."
npm run build

# 4. Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

# 5. Push Convex schema
echo "📊 Pushing Convex schema..."
npx convex deploy --prod

echo "✅ Deployment complete!"
echo "🎉 Your platform is now live at: https://appointmentbooking.co.za"
echo ""
echo "Next steps:"
echo "1. Set up your domain DNS"
echo "2. Configure environment variables"
echo "3. Test the booking flow"
echo "4. Set up monitoring and analytics"