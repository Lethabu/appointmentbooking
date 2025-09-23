#!/bin/bash

# Typebot + AiSensy Production Deployment

echo "🚀 Deploying Typebot + AiSensy Integration..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Build application
echo "🏗️ Building Next.js application..."
npm run build

# 3. Deploy to Vercel
echo "☁️ Deploying to Vercel..."
npx vercel --prod

# 4. Setup Typebot flow
echo "🤖 Setting up Typebot flow..."
echo "Import typebot-flows/instyle-booking-flow.json to https://app.typebot.io"

# 5. Configure webhooks
echo "🔗 Configuring webhooks..."
echo "Set webhook URLs in payment gateways:"
echo "  Paystack: https://appointmentbooking.co.za/api/webhooks/paystack"
echo "  Yoco: https://appointmentbooking.co.za/api/webhooks/yoco"
echo "  Ozow: https://appointmentbooking.co.za/api/webhooks/ozow"
echo "  Typebot: https://appointmentbooking.co.za/api/webhooks/typebot"

# 6. Test WhatsApp integration
echo "📱 Testing WhatsApp integration..."
curl -X POST "https://backend.aisensy.com/campaign/t1/api/v2/sendTemplate" \
  -H "Authorization: Bearer $AISENSY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+27721234567",
    "template": "instyle_welcome",
    "language": "en"
  }'

echo "✅ Deployment complete!"
echo ""
echo "🌟 Your Typebot + AiSensy integration is now live:"
echo "   Main Platform: https://appointmentbooking.co.za"
echo "   InStyle Hair Boutique: https://instylehairboutique.co.za"
echo ""
echo "📋 Next steps:"
echo "   1. Import Typebot flow from typebot-flows/instyle-booking-flow.json"
echo "   2. Configure AiSensy WhatsApp Business number"
echo "   3. Set up payment gateway webhooks"
echo "   4. Test end-to-end booking flow"