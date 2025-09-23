#!/bin/bash

# This script checks a deployed URL for brand leaks.
# Usage: ./scripts/check-deployed-brand.sh <URL> <HOST_HEADER>

URL=$1
HOST=$2

if [ -z "$URL" ] || [ -z "$HOST" ]; then
  echo "Usage: $0 <URL> <HOST_HEADER>"
  exit 1
fi

PLATFORM_STRING="appointmentbooking"

echo "Checking $URL with Host: $HOST for '$PLATFORM_STRING' leaks..."

# Check for platform string in the response body
curl -s -H "Host: $HOST" "$URL" | grep -i "$PLATFORM_STRING" && \
  echo "❌ LEAK: Found '$PLATFORM_STRING' in $URL with Host: $HOST" && \
  exit 1

echo "✅ OK: No '$PLATFORM_STRING' leaks found in $URL with Host: $HOST"

# You can add more checks here, e.g., for 404s as per the original plan
# curl -s -o /dev/null -w "%{\http_code}" -H "Host: $HOST" "$URL/book" | grep 200 && echo "✅ BOOK" || echo "❌ 404"

exit 0
