#!/bin/bash

# Setup automated cron jobs for InStyle Hair Boutique

echo "🤖 Setting up automation cron jobs..."

# Create cron job entries
cat > /tmp/instyle-cron << EOF
# InStyle Hair Boutique Automation Jobs

# Daily sync at 9 AM
0 9 * * * curl -X POST "$NEXT_PUBLIC_BASE_URL/api/automation" -H "Content-Type: application/json" -d '{"action":"daily_sync","tenantId":"ccb12b4d-ade6-467d-a614-7c9d198ddc70"}'

# Weekly report on Mondays at 8 AM
0 8 * * 1 curl -X POST "$NEXT_PUBLIC_BASE_URL/api/automation" -H "Content-Type: application/json" -d '{"action":"weekly_report","tenantId":"ccb12b4d-ade6-467d-a614-7c9d198ddc70"}'

# Abandoned cart recovery every 2 hours
0 */2 * * * curl -X POST "$NEXT_PUBLIC_BASE_URL/api/conversational-commerce" -H "Content-Type: application/json" -d '{"action":"abandoned_cart_recovery","tenantId":"ccb12b4d-ade6-467d-a614-7c9d198ddc70"}'

# Booking reminders at 6 PM daily
0 18 * * * curl -X POST "$NEXT_PUBLIC_BASE_URL/api/automation" -H "Content-Type: application/json" -d '{"action":"daily_sync","tenantId":"ccb12b4d-ade6-467d-a614-7c9d198ddc70"}'
EOF

# Install cron jobs
crontab /tmp/instyle-cron
rm /tmp/instyle-cron

echo "✅ Cron jobs installed successfully"
echo "📋 Active automation schedule:"
echo "  - Daily sync: 9:00 AM"
echo "  - Weekly reports: Monday 8:00 AM"
echo "  - Cart recovery: Every 2 hours"
echo "  - Booking reminders: 6:00 PM daily"