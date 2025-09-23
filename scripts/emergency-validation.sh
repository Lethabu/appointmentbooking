#!/bin/bash
# scripts/emergency-validation.sh

set -e

echo "🔍 Emergency Validation Suite"
echo "=============================="

# Domain accessibility test
echo "1. Testing domain accessibility..."
domains=("www.instylehairboutique.co.za" "instylehairboutique.appointmentbooking.co.za")

for domain in "${domains[@]}"; do
    echo "Testing $domain..."
    
    # Check if domain resolves and returns content
    response=$(curl -s -o /dev/null -w "%{http_code},%{size_download}" "https://$domain")
    status_code=$(echo $response | cut -d',' -f1)
    content_size=$(echo $response | cut -d',' -f2)
    
    if [ "$status_code" = "200" ] && [ "$content_size" -gt "1000" ]; then
        echo "  ✅ $domain: OK ($status_code, ${content_size}bytes)"
    else
        echo "  ❌ $domain: FAIL ($status_code, ${content_size}bytes)"
        exit 1
    fi
done

# Tenant isolation test
echo "2. Testing tenant isolation..."
instyle_response=$(curl -s -H "Host: www.instylehairboutique.co.za" "https://appointmentbooking.co.za")

if echo "$instyle_response" | grep -q "InStyle Hair Boutique"; then
    echo "  ✅ Tenant isolation: OK (InStyle branding detected)"
else
    echo "  ❌ Tenant isolation: FAIL (Platform branding leaked)"
    exit 1
fi

# Booking functionality test
echo "3. Testing booking functionality..."
booking_response=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: www.instylehairboutique.co.za" "https://appointmentbooking.co.za/book")

if [ "$booking_response" = "200" ]; then
    echo "  ✅ Booking page: OK ($booking_response)"
else
    echo "  ❌ Booking page: FAIL ($booking_response)"
    exit 1
fi

# API endpoint test
echo "4. Testing API endpoints..."
api_response=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: www.instylehairboutique.co.za" "https://appointmentbooking.co.za/api/monitoring/health")

if [ "$api_response" = "200" ]; then
    echo "  ✅ Health API: OK ($api_response)"
else
    echo "  ❌ Health API: FAIL ($api_response)"
    exit 1
fi

echo ""
echo "🎉 All validation checks passed!"
echo "Platform is ready for handover."
