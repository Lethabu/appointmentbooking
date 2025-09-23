#!/bin/bash
# monitor.sh - System health monitoring

LOG_FILE="/var/log/instyle-monitor.log"
DATE=$(date)

# Check all services
BOOKING_STATUS=$(curl -s -f http://localhost:8000/health >/dev/null && echo "UP" || echo "DOWN")
AI_STATUS=$(curl -s -f http://localhost:8001/health >/dev/null && echo "UP" || echo "DOWN")
DB_STATUS=$(docker exec instyle-postgres pg_isready -U postgres >/dev/null 2>&1 && echo "UP" || echo "DOWN")

# Get current metrics
BOOKINGS_TODAY=$(docker exec instyle-postgres psql -U postgres -d appointmentbooking -tAc "
    SELECT COUNT(*) FROM bookings 
    WHERE DATE(start_time) = CURRENT_DATE 
    AND tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
" 2>/dev/null || echo "0")

# Log status
echo "[$DATE] Status: API=$BOOKING_STATUS AI=$AI_STATUS DB=$DB_STATUS | Today: $BOOKINGS_TODAY bookings" >> $LOG_FILE

# Alert if any service is down
if [ "$BOOKING_STATUS" = "DOWN" ] || [ "$AI_STATUS" = "DOWN" ] || [ "$DB_STATUS" = "DOWN" ]; then
    echo "[$DATE] ALERT: Service(s) down - API=$BOOKING_STATUS AI=$AI_STATUS DB=$DB_STATUS" >> $LOG_FILE
fi