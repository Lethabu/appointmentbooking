#!/bin/bash

# AppointmentBooking SaaS Deployment Script

echo "🚀 Starting AppointmentBooking SaaS Deployment..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Run Supabase migrations
echo "🗄️ Running database migrations..."
npx supabase db push

# 3. Seed initial data
echo "🌱 Seeding initial data..."
npx supabase db reset --linked

# 4. Build Next.js application
echo "🏗️ Building application..."
npm run build

# 5. Deploy to Vercel
echo "☁️ Deploying to Vercel..."
npx vercel --prod

# 6. Setup custom domains
echo "🌐 Setting up custom domains..."
npx vercel domains add appointmentbooking.co.za
npx vercel domains add instylehairboutique.co.za

echo "✅ Deployment complete!"
echo ""
echo "🌟 Your platforms are now live:"
echo "   Main Platform: https://appointmentbooking.co.za"
echo "   InStyle Hair Boutique: https://instylehairboutique.co.za"
echo ""
echo "📋 Next steps:"
echo "   1. Configure Typebot flows at https://typebot.io"
echo "   2. Setup AiSensy WhatsApp integration"
echo "   3. Configure payment webhooks"
echo "   4. Test booking flow end-to-end"