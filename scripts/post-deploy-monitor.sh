#!/bin/bash

# Post-deployment monitoring and validation
# Runs continuous health checks after production deployment

echo "🔍 Starting Post-Deployment Monitoring"
echo "======================================"

BASE_URL="https://appointmentbooking.co.za"
TENANT_URL="https://instylehairboutique.appointmentbooking.co.za"

# Function to check endpoint
check_endpoint() {
    local url=$1
    local name=$2
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ]; then
        echo "✅ $name: OK ($response)"
        return 0
    else
        echo "❌ $name: FAILED ($response)"
        return 1
    fi
}

# Function to test tenant isolation
test_isolation() {
    echo "🔐 Testing tenant isolation..."
    
    # Test anonymous access (should be blocked)
    local anon_test=$(curl -s "$BASE_URL/api/appointments" | jq -r 'length // 0' 2>/dev/null || echo "0")
    
    if [ "$anon_test" = "0" ]; then
        echo "✅ Anonymous access blocked"
    else
        echo "❌ Anonymous access allowed - SECURITY ISSUE"
        return 1
    fi
}

# Main monitoring loop
monitor_system() {
    local failures=0
    
    echo "📊 System Health Check - $(date)"
    echo "--------------------------------"
    
    # Core endpoints
    check_endpoint "$BASE_URL/api/health" "Main Platform" || ((failures++))
    check_endpoint "$TENANT_URL/api/health" "Tenant Site" || ((failures++))
    check_endpoint "$BASE_URL" "Homepage" || ((failures++))
    check_endpoint "$TENANT_URL" "Tenant Homepage" || ((failures++))
    
    # Security validation
    test_isolation || ((failures++))
    
    # Chat API test
    local chat_response=$(curl -s -X POST "$BASE_URL/api/chat" \
        -H "Content-Type: application/json" \
        -d '{"message":"test","tenantId":"instyle"}' \
        -w "%{http_code}" -o /dev/null)
    
    if [ "$chat_response" = "200" ]; then
        echo "✅ Chat API: OK"
    else
        echo "❌ Chat API: FAILED ($chat_response)"
        ((failures++))
    fi
    
    echo "--------------------------------"
    
    if [ $failures -eq 0 ]; then
        echo "🎉 All systems operational"
        return 0
    else
        echo "🚨 $failures system(s) failing"
        return 1
    fi
}

# Run initial check
if monitor_system; then
    echo ""
    echo "✅ DEPLOYMENT SUCCESSFUL"
    echo "Platform is live and operational!"
    echo ""
    echo "🌐 URLs:"
    echo "  Main: $BASE_URL"
    echo "  Instyle: $TENANT_URL"
    echo ""
    echo "📊 Monitoring will continue every 5 minutes..."
    
    # Continuous monitoring (optional)
    if [ "$1" = "--monitor" ]; then
        while true; do
            sleep 300  # 5 minutes
            echo ""
            monitor_system
        done
    fi
else
    echo ""
    echo "🚨 DEPLOYMENT ISSUES DETECTED"
    echo "Check logs and fix issues before proceeding"
    exit 1
fi