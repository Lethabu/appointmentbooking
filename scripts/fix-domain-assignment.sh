#!/bin/bash
# scripts/fix-domain-assignment.sh

set -e

echo "🚨 EMERGENCY DOMAIN REASSIGNMENT"
echo "================================"

# Step 1: Remove domain from ALL projects (brute force)
echo "Removing domain from all potential projects..."

# Common project patterns to check
PROJECT_NAMES=(
  "appointmentbooking"
  "appointmentbooking-main"
  "appointmentbooking-marketing"
  "appointmentbooking-platform"
  "tenant-wrapper"
  "multi-tenant-app"
)

for project in "${PROJECT_NAMES[@]}"; do
  echo "Checking project: $project"
  vercel domains rm www.instylehairboutique.co.za --scope lethabus-projects --yes 2>/dev/null || echo "  Domain not in $project"
done

# Step 2: Ensure we're in the correct tenant-wrapper project
echo -e "
📁 SWITCHING TO TENANT-WRAPPER PROJECT:"
cd /home/user/appointmentbooking/tenant-wrapper 2>/dev/null || echo "Creating tenant-wrapper context..."

# Initialize if needed
if [[ ! -f "package.json" ]]; then
  echo '{
    "name": "appointmentbooking-tenant-wrapper",
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start"
    },
    "dependencies": {
      "next": "latest",
      "react": "latest",
      "react-dom": "latest"
    }
  }' > package.json
fi

# Step 3: Add domain to correct project
echo -e "
➕ ADDING DOMAIN TO TENANT-WRAPPER:"
vercel link --yes
vercel domains add www.instylehairboutique.co.za tenant-wrapper --scope lethabus-projects

# Step 4: Verify assignment
echo -e "
✅ VERIFICATION:"
vercel domains ls --scope lethabus-projects | grep instyle
vercel domains inspect www.instylehairboutique.co.za --scope lethabus-projects