#!/bin/bash
# audit.sh - Script to perform baseline audit checks for the Leapfrog Sprint.

# --- Configuration ---
# Replace with the actual tenant URL to be tested.
# This assumes a local DNS entry or a deployed preview environment.
TENANT_URL="http://instyle.appointmentbookings.co.za"
BOOKING_PATH="/booking" # A representative path for a booking page

echo "--- Starting Platform Audit ---"
echo "Target Tenant: $TENANT_URL"
echo ""

# 1. Domain Leak Scan
# Checks if the tenant's page contains strings from the main platform (e.g., "appointmentbooking").
echo "[1/3] Performing Domain Leak Scan..."
if curl -s -L "$TENANT_URL" | grep -i -q "appointmentbooking"; then
    echo "  => RESULT: LEAK DETECTED. Platform branding found on tenant site."
else
    echo "  => RESULT: OK. No obvious platform branding leak found in the response body."
fi
echo ""

# 2. Header/Footer Origin Check
# Checks for the custom header 'x-component-origin' to see if it's incorrectly set to 'platform_default'.
echo "[2/3] Performing Header/Footer Origin Check..."
if curl -s -I -L "$TENANT_URL" | grep -i -q "x-component-origin: platform_default"; then
    echo "  => RESULT: LEAK DETECTED. 'x-component-origin' is 'platform_default'."
else
    echo "  => RESULT: OK. Header 'x-component-origin' is not 'platform_default' or not present."
fi
echo ""

# 3. Booking 404 / Stall Check
# Checks the HTTP status of a critical booking path. The blueprint mentions a "200 but stalled" issue,
# so we check the status code as a first-level indicator. A 404 would be a critical failure.
echo "[3/3] Performing Booking Page Check..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "$TENANT_URL$BOOKING_PATH")
echo "  => RESULT: Received HTTP status code '$STATUS_CODE' for the booking page ($TENANT_URL$BOOKING_PATH)."
if [ "$STATUS_CODE" -ne 200 ]; then
    echo "  => WARNING: Booking page is not returning a 200 OK status. This confirms a critical issue."
else
    echo "  => INFO: Booking page returned a 200 OK. The issue might be a client-side stall, as per the audit."
fi
echo ""

echo "--- Audit Complete ---"