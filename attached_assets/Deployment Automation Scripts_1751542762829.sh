#!/bin/bash
# deploy-prod.sh

# Environment setup
ENV="production"
REGION="cpt1"
VERSION=$(git rev-parse --short HEAD)

# Build application
echo "Building application v$VERSION..."
npm run build:$ENV

# Database migration
echo "Running database migrations..."
psql $SUPABASE_PROD_URL -f migrations/latest.sql

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel deploy --prod --confirm -b NEXT_PUBLIC_ENV=$ENV -b SUPABASE_URL=$SUPABASE_PROD_URL

# Create release tag
git tag -a v$VERSION -m "Production release $VERSION"
git push origin v$VERSION

# Notify monitoring
curl -X POST https://api.monitoring.service/events -d '{
  "service": "appointmentbookings",
  "event": "deployment",
  "version": "'$VERSION'",
  "environment": "'$ENV'"
}'

echo "Deployment completed successfully!"