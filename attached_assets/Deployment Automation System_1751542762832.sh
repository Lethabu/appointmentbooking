#!/bin/bash
# deploy-prod.sh

# Environment configuration
ENV="prod"
REGION="cpt1"
VERSION=$(git rev-parse --short HEAD)
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# 1. Pre-deployment checks
echo "🔄 Running pre-deployment checks..."
npm run lint
npm run test:e2e --env=prod
DB_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/")
if [ "$DB_HEALTH" -ne 200 ]; then
  echo "❌ Database health check failed!"
  exit 1
fi

# 2. Build optimized production bundle
echo "🔧 Building production bundle (v$VERSION)..."
NEXT_PUBLIC_ENV=$ENV npm run build:prod

# 3. Database migration
echo "💾 Applying database migrations..."
psql $SUPABASE_PROD_URL -f migrations/deploy-$TIMESTAMP.sql

# 4. Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel deploy --prod --confirm -b NEXT_PUBLIC_ENV=$ENV -b SUPABASE_URL=$SUPABASE_PROD_URL

# 5. Warm-up critical paths
echo "🔥 Warming up critical paths..."
CRITICAL_PATHS=(
  "/api/health"
  "/dashboard"
  "/api/services"
  "/api/products"
)
for path in "${CRITICAL_PATHS[@]}"; do
  curl -s -o /dev/null "https://appointmentbookings.co.za$path"
done

# 6. Feature flag activation
echo "🎚️ Activating feature flags..."
curl -X PATCH "$SUPABASE_URL/rest/v1/feature_flags" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "ecommerce": true,
    "ai_agents": true,
    "whatsapp_reminders": true
  }'

# 7. Monitoring initialization
echo "📊 Initializing monitoring..."
curl -X POST "https://api.monitoring.service/v1/setup" \
  -H "Authorization: Bearer $MONITORING_TOKEN" \
  -d '{
    "site_id": "appointmentbookings-prod",
    "alert_emails": ["devops@appointmentbookings.co.za"],
    "performance_thresholds": {
      "response_time": 2000,
      "error_rate": 0.01,
      "throughput": 100
    }
  }'

# 8. Deployment logging
echo "📝 Logging deployment..."
curl -X POST "$SUPABASE_URL/rest/v1/deployment_logs" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "'$VERSION'",
    "environment": "'$ENV'",
    "region": "'$REGION'",
    "status": "success"
  }'

echo "✅ Production deployment completed successfully!"