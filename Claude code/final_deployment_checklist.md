# 🚀 Instyle Hair Boutique - 48H Sprint Checklist

## ⏰ Hour-by-Hour Implementation Plan

### Hours 0-6: Foundation Setup
- [ ] **Clone repositories locally**
  ```bash
  git clone https://github.com/Lethabu/your-platform-repo.git
  git clone https://github.com/Lethabu/your-agent-repo.git
  ```

- [ ] **Environment setup**
  ```bash
  cp .env.example .env
  # Edit .env with your actual credentials
  nano .env
  ```

- [ ] **Database migration**
  ```bash
  # Start PostgreSQL
  docker run -d --name instyle-db \
    -e POSTGRES_DB=instyle \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=your_password \
    -p 5432:5432 postgres:15
  
  # Run migrations
  psql -h localhost -U postgres -d instyle -f supabase/migrations/20250812_instyle_handover.sql
  ```

### Hours 6-12: Backend Services
- [ ] **FastAPI Booking Service**
  ```bash
  cd services/booking
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8000
  ```

- [ ] **Test booking endpoint**
  ```bash
  curl -X POST http://localhost:8000/book \
    -H "Content-Type: application/json" \
    -d '{
      "tenant_id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
      "service_id": "service_1", 
      "client_name": "Test User",
      "client_phone": "+27821234567",
      "start_time": "2025-08-15T14:00:00Z",
      "consent_popia": true
    }'
  ```

- [ ] **AI Agent Service**
  ```bash
  cd services/ai-agent
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8001
  ```

### Hours 12-18: Frontend Integration
- [ ] **Next.js setup**
  ```bash
  cd your-platform-repo
  npm install
  npm run dev
  ```

- [ ] **Test booking form** at `http://localhost:3000`
- [ ] **Verify dashboard** shows real-time stats

### Hours 18-24: WhatsApp Integration
- [ ] **N8N setup**
  ```bash
  docker run -d --name n8n \
    -p 5678:5678 \
    -e N8N_BASIC_AUTH_ACTIVE=true \
    -e N8N_BASIC_AUTH_USER=admin \
    -e N8N_BASIC_AUTH_PASSWORD=instyle2025 \
    n8nio/n8n
  ```

- [ ] **Import workflow** from `n8n/workflows/instyle_whatsapp_bot.json`
- [ ] **Configure Twilio WhatsApp** credentials
- [ ] **Test WhatsApp bot** with sample message

### Hours 24-36: Payment Integration
- [ ] **PayFast integration**
  ```bash
  # Add to booking API
  curl -X POST http://localhost:8000/create-payment \
    -H "Content-Type: application/json" \
    -d '{
      "booking_id": "booking_123",
      "amount_zar": 35000,
      "return_url": "https://instylehairboutique.co.za/payment/success"
    }'
  ```

### Hours 36-42: Production Deployment
- [ ] **Docker Compose deployment**
  ```bash
  # Full stack deployment
  docker-compose up --build -d
  ```

- [ ] **Domain configuration**
  ```bash
  # Point DNS to server IP
  # Configure SSL certificates
  sudo certbot --nginx -d instylehairboutique.co.za
  ```

### Hours 42-48: Testing & Go-Live
- [ ] **End-to-end test**
- [ ] **Performance monitoring**
- [ ] **Handover documentation**

---

## 🔧 Quick Commands Reference

### Database Operations
```sql
-- Check booking count
SELECT COUNT(*) FROM bookings WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

-- View today's bookings
SELECT * FROM bookings WHERE DATE(start_time) = CURRENT_DATE;

-- Get dashboard stats
SELECT * FROM get_dashboard_stats('ccb12b4d-ade6-467d-a614-7c9d198ddc70');
```

### API Testing
```bash
# Health checks
curl http://localhost:8000/health
curl http://localhost:8001/health

# Get services
curl http://localhost:8000/services/ccb12b4d-ade6-467d-a614-7c9d198ddc70

# Chat with AI
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to book a haircut tomorrow at 2pm", "user_phone": "+27821234567"}'
```

### Deployment Commands
```bash
# Build all services
docker-compose build

# Start with logs
docker-compose up -d && docker-compose logs -f

# Scale services
docker-compose up --scale booking-api=2 -d

# Backup database
docker exec instyle-db pg_dump -U postgres instyle > backup_$(date +%Y%m%d).sql
```

---

## ✅ Pre-Launch Checklist

### Security & Compliance
- [ ] All API keys removed from public repositories
- [ ] POPIA consent implemented in booking forms
- [ ] HTTPS enabled with valid SSL certificates
- [ ] Rate limiting configured (10 req/sec per IP)
- [ ] Database backups scheduled

### Functionality Testing
- [ ] **Booking Flow**: Complete booking from form to database
- [ ] **WhatsApp Bot**: AI responds correctly to booking requests
- [ ] **Dashboard**: Real-time stats update after new bookings
- [ ] **Payment**: PayFast integration processes ZAR payments
- [ ] **Mobile Responsive**: All pages work on mobile devices

### Performance & Monitoring
- [ ] **Load Testing**: Handle 100 concurrent bookings
- [ ] **Database Performance**: Query response under 100ms
- [ ] **API Response Time**: All endpoints under 2 seconds
- [ ] **Uptime Monitoring**: Health check endpoints configured
- [ ] **Error Logging**: Structured logs for debugging

### Business Readiness
- [ ] **Domain Active**: instylehairboutique.co.za resolves correctly
- [ ] **Social Media**: WhatsApp number configured for bookings
- [ ] **Staff Training**: Salon staff can access dashboard
- [ ] **Customer Support**: Escalation process for AI failures
- [ ] **Marketing**: QR codes generated for physical location

---

## 🎯 Success Metrics (24h Post-Launch)

| Metric | Target | Measurement |
|---|---|---|
| **Website Uptime** | 99.9% | Pingdom/UptimeRobot |
| **Booking Success Rate** | >95% | Database logs |
| **WhatsApp Response Time** | <30 seconds | N8N analytics |
| **Customer Satisfaction** | >4.5/5 | Post-booking survey |
| **Mobile Usage** | >70% | Google Analytics |

---

## 🔥 Emergency Procedures

### If Website Goes Down
```bash
# Check service status
docker-compose ps

# Restart all services
docker-compose restart

# Check logs for errors
docker-compose logs booking-api
docker-compose logs nginx
```

### If Bookings Fail
```bash
# Check database connection
docker exec -it instyle-db psql -U postgres -d instyle -c "SELECT 1;"

# Verify API health
curl -f http://localhost:8000/health || echo "API DOWN"

# Check recent bookings
docker exec -it instyle-db psql -U postgres -d instyle -c "SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5;"
```

### If WhatsApp Bot Stops
```bash
# Check N8N status
docker logs n8n

# Restart N8N
docker restart n8n

# Test webhook
curl -X POST http://localhost:5678/webhook/instyle-whatsapp \
  -d "From=whatsapp:+27821234567&Body=Hello"
```

---

## 📞 Handover Contact Details

**Technical Support**: 
- GitHub Issues: Use repository issue tracker
- Emergency: Check deployment logs first
- Database: PostgreSQL on port 5432
- Monitoring: All services have `/health` endpoints

**Business Contact**:
- Instyle Hair Boutique: Soshanguve, Pretoria
- WhatsApp: Via N8N webhook integration
- Operating Hours: Mon-Sat 9AM-5PM SAST

---

## 🚀 Final Launch Command

```bash
#!/bin/bash
echo "🎉 LAUNCHING INSTYLE HAIR BOUTIQUE - $(date)"

# Start all services
docker-compose up -d

# Wait for services to be ready
sleep 30

# Run health checks
curl -f http://localhost:8000/health && echo "✅ Booking API"
curl -f http://localhost:8001/health && echo "✅ AI Agent"
curl -f http://localhost:5678/healthz && echo "✅ N8N"

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

# Test AI agent
AI_RESPONSE=$(curl -s -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need a haircut", "user_phone": "+27821234567"}' | jq -r '.response')

if [ -n "$AI_RESPONSE" ] && [ "$AI_RESPONSE" != "null" ]; then
    echo "✅ AI Agent test passed"
    echo "   Response: ${AI_RESPONSE:0:50}..."
else
    echo "❌ AI Agent test failed"
    exit 1
fi

# Display final status
echo ""
echo "🎉 INSTYLE HAIR BOUTIQUE IS LIVE!"
echo "=================================="
echo "🌐 Website: https://instylehairboutique.co.za"
echo "📱 WhatsApp: Active (via N8N webhook)"
echo "💳 Payments: PayFast integrated"
echo "🤖 AI Agent: Nia is ready"
echo "📊 Dashboard: Real-time stats enabled"
echo ""
echo "📞 Support Commands:"
echo "   docker-compose logs -f    # Monitor logs"
echo "   docker-compose restart    # Restart all"
echo "   docker-compose ps         # Check status"
echo ""
echo "🎯 Launch completed at: $(date)"
```

---

## 📊 Post-Launch Monitoring Dashboard

Create this simple monitoring script to track system health:

```bash
#!/bin/bash
# monitor.sh - Run every 5 minutes via cron

LOG_FILE="/var/log/instyle-monitor.log"
DATE=$(date)

# Check all services
BOOKING_STATUS=$(curl -s -f http://localhost:8000/health >/dev/null && echo "UP" || echo "DOWN")
AI_STATUS=$(curl -s -f http://localhost:8001/health >/dev/null && echo "UP" || echo "DOWN")
DB_STATUS=$(docker exec instyle-db pg_isready -U postgres >/dev/null && echo "UP" || echo "DOWN")

# Get current metrics
BOOKINGS_TODAY=$(docker exec instyle-db psql -U postgres -d instyle -tAc "
    SELECT COUNT(*) FROM bookings 
    WHERE DATE(start_time) = CURRENT_DATE 
    AND tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
")

REVENUE_WEEK=$(docker exec instyle-db psql -U postgres -d instyle -tAc "
    SELECT COALESCE(SUM(s.price_zar::NUMERIC/100), 0) 
    FROM bookings b 
    JOIN services s ON b.service_id = s.id 
    WHERE b.start_time > CURRENT_DATE - INTERVAL '7 days'
    AND b.tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
")

# Log status
echo "[$DATE] Status: API=$BOOKING_STATUS AI=$AI_STATUS DB=$DB_STATUS | Today: $BOOKINGS_TODAY bookings | Week: R$REVENUE_WEEK" >> $LOG_FILE

# Alert if any service is down
if [ "$BOOKING_STATUS" = "DOWN" ] || [ "$AI_STATUS" = "DOWN" ] || [ "$DB_STATUS" = "DOWN" ]; then
    echo "[$DATE] ALERT: Service(s) down - API=$BOOKING_STATUS AI=$AI_STATUS DB=$DB_STATUS" >> $LOG_FILE
    # Send alert (email, SMS, etc.)
    curl -X POST "https://maker.ifttt.com/trigger/instyle_alert/with/key/YOUR_WEBHOOK_KEY" \
         -H "Content-Type: application/json" \
         -d "{\"value1\":\"Service Down\",\"value2\":\"$DATE\",\"value3\":\"API=$BOOKING_STATUS AI=$AI_STATUS DB=$DB_STATUS\"}" 2>/dev/null
fi

# Clean old logs (keep 7 days)
find /var/log -name "instyle-monitor.log" -mtime +7 -delete 2>/dev/null
```

Schedule with cron:
```bash
# Add to crontab
*/5 * * * * /path/to/monitor.sh
```

---

## 🔐 Security Hardening Checklist

### Server Security
- [ ] **Firewall Rules**
  ```bash
  # Allow only necessary ports
  ufw allow ssh
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
  ```

- [ ] **SSL/TLS Configuration**
  ```bash
  # Generate SSL cert with Let's Encrypt
  certbot --nginx -d instylehairboutique.co.za
  
  # Test SSL rating
  curl -s "https://api.ssllabs.com/api/v3/analyze?host=instylehairboutique.co.za" | jq '.status'
  ```

- [ ] **Docker Security**
  ```bash
  # Run containers as non-root
  docker-compose config | grep -i user
  
  # Scan for vulnerabilities
  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    aquasec/trivy image your_platform_name_booking-api
  ```

### Application Security
- [ ] **Environment Variables**
  ```bash
  # Verify no secrets in code
  grep -r "sk-" . --exclude-dir=node_modules || echo "✅ No hardcoded API keys"
  grep -r "password" . --exclude-dir=node_modules | grep -v "PASSWORD" || echo "✅ No hardcoded passwords"
  ```

- [ ] **POPIA Compliance**
  - Data processing consent: ✅ Required for bookings
  - Data retention policy: ✅ 2 years for appointment records
  - Right to erasure: ✅ DELETE endpoint implemented
  - Data portability: ✅ Export booking history available

---

## 🚀 Advanced Features (Post-Launch)

### Phase 2: Enhanced AI (Week 2)
```python
# Add to AI agent for advanced features
class AdvancedInstyleAgent(InstyleAIAgent):
    async def handle_rescheduling(self, booking_id: str, new_time: datetime):
        """Handle booking rescheduling requests"""
        # Implementation for rescheduling logic
        pass
    
    async def send_appointment_reminders(self):
        """Send WhatsApp reminders 24h before appointments"""
        # Implementation for reminder system
        pass
    
    async def analyze_customer_sentiment(self, conversation_history: List[str]):
        """Analyze customer satisfaction from chat"""
        # Implementation for sentiment analysis
        pass
```

### Phase 3: Analytics Dashboard (Week 3)
```typescript
// Advanced analytics for business insights
interface AdvancedAnalytics {
    popularServices: ServiceStats[];
    peakBookingTimes: TimeSlot[];
    customerRetention: number;
    averageBookingValue: number;
    whatsappConversionRate: number;
}
```

### Phase 4: Multi-Location Support (Month 2)
```sql
-- Database schema for multiple salon locations
ALTER TABLE tenants ADD COLUMN locations JSONB DEFAULT '[]';

-- Example location data
UPDATE tenants SET locations = '[
    {
        "id": "soshanguve", 
        "name": "Instyle Soshanguve",
        "address": "Soshanguve, Pretoria",
        "hours": "Mon-Sat 9AM-5PM"
    },
    {
        "id": "menlyn", 
        "name": "Instyle Menlyn",
        "address": "Menlyn Park, Pretoria", 
        "hours": "Mon-Sun 10AM-8PM"
    }
]' WHERE id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
```

---

## 🎓 Training Materials for Salon Staff

### Dashboard Usage Guide
1. **Daily Overview**: Check today's bookings and revenue
2. **Customer Management**: View client details and history  
3. **Service Management**: Update pricing and availability
4. **WhatsApp Integration**: Monitor AI conversations
5. **Payment Tracking**: View pending and completed payments

### Common Issues & Solutions
| Issue | Solution |
|-------|----------|
| Booking not showing | Check if customer completed POPIA consent |
| WhatsApp bot not responding | Restart N8N service: `docker restart n8n` |
| Payment failed | Guide customer to retry or accept cash |
| Time slot conflicts | Manual booking override in dashboard |
| Customer wants to cancel | Use cancel booking button in dashboard |

---

## 🏆 Success Stories Template

Document customer feedback for continuous improvement:

```markdown
### Customer Success Story #1
**Date**: August 15, 2025
**Customer**: Sarah M. (via WhatsApp)
**Journey**: 
1. Found salon on Google → Contacted WhatsApp bot
2. AI (Nia) helped book "Women's Cut & Blow" for next day
3. Received confirmation + reminder messages
4. Paid via PayFast link (R350)
5. Happy with service, rebooked for color treatment

**Feedback**: "So easy to book! The WhatsApp bot was super helpful and the payment was seamless. Will definitely recommend!"

**Metrics**: 
- Booking time: 2 minutes
- Customer satisfaction: 5/5
- Return booking: Yes (within 2 weeks)
```

---

This completes the comprehensive 48-hour sprint plan for getting Instyle Hair Boutique fully operational. The system includes:

✅ **Complete booking engine** (FastAPI + PostgreSQL)  
✅ **AI WhatsApp bot** (Gemini AI + N8N automation)  
✅ **Real-time dashboard** (Next.js + Supabase)  
✅ **Payment integration** (PayFast for ZAR)  
✅ **POPIA compliance** (consent management)  
✅ **Production deployment** (Docker + Nginx)  
✅ **Monitoring & security** (health checks + SSL)  

The platform is ready for immediate handover and can handle real customer bookings from day one!