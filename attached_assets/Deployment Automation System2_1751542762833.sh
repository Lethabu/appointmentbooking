#!/bin/bash
# deploy-prod.sh

# Environment configuration
ENV="prod"
REGIONS=("cpt1" "jnb1")  # Cape Town & Johannesburg
VERSION=$(git rev-parse --short HEAD)
TIMESTAMP=$(date +%Y%m%d%H%M%S)
DEPLOY_ID="${ENV}-${VERSION}-${TIMESTAMP}"

# 1. Pre-flight checks
echo "🚦 Running pre-deployment checks..."
npm run security-audit
npm run load-test --env=prod --users=10000 --duration=10
DB_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/health")
[ "$DB_HEALTH" -ne 200 ] && { echo "❌ Database health check failed"; exit 1; }

# 2. Build optimized production bundle
echo "🔨 Building production bundle v$VERSION..."
NEXT_PUBLIC_ENV=$ENV npm run build:prod

# 3. Database migration
echo "🔄 Applying database migrations..."
psql $SUPABASE_PROD_URL -f migrations/$VERSION.sql

# 4. Multi-region deployment
for REGION in "${REGIONS[@]}"; do
  echo "🌍 Deploying to $REGION region..."
  vercel deploy --prod --confirm -b NEXT_PUBLIC_ENV=$ENV \
    -b SUPABASE_URL=$SUPABASE_PROD_URL \
    --regions=$REGION \
    --meta deploy-id=$DEPLOY_ID
done

# 5. CDN warm-up
echo "🔥 Warming up CDN cache..."
warmup_urls=(
  "/"
  "/api/health"
  "/dashboard"
  "/book"
  "/shop"
)
for url in "${warmup_urls[@]}"; do
  curl -s -o /dev/null "https://appointmentbookings.co.za$url"
done

# 6. Feature flag activation
echo "🚩 Activating feature flags..."
curl -X PATCH "$SUPABASE_URL/rest/v1/feature_flags" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "ecommerce": true,
    "ai_agents": true,
    "whatsapp_reminders": true,
    "dynamic_pricing": true
  }'

# 7. Monitoring initialization
echo "📡 Initializing monitoring..."
curl -X POST "https://api.monitoring.service/v1/sites" \
  -H "Authorization: Bearer $MONITORING_TOKEN" \
  -d '{
    "site_id": "appointmentbookings-prod",
    "url": "https://appointmentbookings.co.za",
    "checks": ["http", "tcp", "ssl"],
    "alert_channels": ["slack", "pagerduty"]
  }'

# 8. Deployment logging
echo "📝 Logging deployment..."
curl -X POST "$SUPABASE_URL/rest/v1/deployment_logs" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "deploy_id": "'$DEPLOY_ID'",
    "version": "'$VERSION'",
    "environment": "'$ENV'",
    "regions": "'${REGIONS[@]}'",
    "status": "deployed"
  }'

# 9. Launch sequence initiation
echo "🚀 Starting launch sequence..."
node launch-sequence.js --env=prod

echo "✅ Production deployment $DEPLOY_ID completed successfully!"