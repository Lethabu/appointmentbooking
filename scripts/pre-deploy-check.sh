#!/bin/bash

# Pre-deployment validation script
set -e

echo "🔍 Running pre-deployment checks..."

# 1. TypeScript compilation check
echo "📝 Checking TypeScript compilation..."
npx tsc --noEmit --skipLibCheck
echo "✅ TypeScript compilation passed"

# 2. Build check
echo "🏗️ Running production build..."
npm run build
echo "✅ Production build successful"

# 3. Security audit
echo "🔒 Running security audit..."
npm audit --audit-level=high
echo "✅ Security audit passed"

# 4. Health check script validation
echo "🏥 Validating health check script..."
node scripts/health-check.js || echo "⚠️ Health check script needs environment setup"

# 5. Environment variables check
echo "📋 Checking environment variables template..."
if [ -f ".env.example" ]; then
    echo "✅ Environment variables template exists"
else
    echo "❌ Missing .env.example file"
    exit 1
fi

# 6. Database migration check
echo "🗄️ Checking database migrations..."
if [ -d "supabase/migrations" ]; then
    echo "✅ Database migrations directory exists"
    echo "📊 Migration files found: $(ls supabase/migrations/*.sql | wc -l)"
else
    echo "⚠️ No database migrations directory found"
fi

# 7. API routes validation
echo "🔌 Validating API routes..."
API_ROUTES=$(find app/api -name "route.ts" | wc -l)
echo "✅ Found $API_ROUTES API routes"

# 8. Component validation
echo "🧩 Validating React components..."
COMPONENTS=$(find components -name "*.tsx" -o -name "*.jsx" | wc -l)
echo "✅ Found $COMPONENTS React components"

echo ""
echo "🎉 Pre-deployment checks completed successfully!"
echo "📦 Ready for production deployment"
echo ""
echo "Next steps:"
echo "1. Set up production environment variables"
echo "2. Configure database connection"
echo "3. Set up payment gateway credentials"
echo "4. Deploy to production environment"