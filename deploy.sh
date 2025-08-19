#!/bin/bash

echo "🚀 Deploying AppointmentBookings Platform..."

# Build and deploy main platform
echo "📦 Building Next.js application..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

# Deploy AI Agent to AWS (placeholder)
echo "🤖 AI Agent deployment ready..."
echo "Run: docker build -t booking-ai ./ai-agent && docker run -p 8000:8000 booking-ai"

echo "✅ Deployment complete!"
echo "🔗 Main platform: https://appointmentbookings.co.za"
echo "🔗 Instyle: https://instylehairboutique.co.za"