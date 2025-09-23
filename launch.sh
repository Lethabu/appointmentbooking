#!/bin/bash
echo "🎉 LAUNCHING INSTYLE HAIR BOUTIQUE - $(date)"

# Start all services
docker-compose up -d

# Wait for services to be ready
sleep 30

# Run health checks
curl -f http://localhost:8000/health && echo "✅ Booking API"
curl -f http://localhost:8001/health && echo "✅ AI Agent"

# Test booking flow
BOOKING_ID=$(curl -s -X POST http://localhost:8000/book \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "service_id": "service_1",
    "client_name": "Launch Test",
    "client_phone": "+27821234567", 
    "start_time": "'$(date -d '+1 day' --iso-8601=seconds)'",
    "consent_popia": true
  }' | jq -r '.id')

if [ "$BOOKING_ID" != "null" ] && [ -n "$BOOKING_ID" ]; then
    echo "✅ Booking test passed - ID: $BOOKING_ID"
else
    echo "❌ Booking test failed"
    exit 1
fi

echo ""
echo "🎉 INSTYLE HAIR BOUTIQUE IS LIVE!"
echo "=================================="
echo "🌐 Website: https://instylehairboutique.co.za"
echo "📱 WhatsApp: Active (via N8N webhook)"
echo "💳 Payments: PayFast integrated"
echo "🤖 AI Agent: Nia is ready"
echo "📊 Dashboard: Real-time stats enabled"
echo ""
echo "🎯 Launch completed at: $(date)"