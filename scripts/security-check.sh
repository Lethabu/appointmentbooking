#!/bin/bash

# Security validation for production deployment

echo "🔒 Running security checks..."

# Check for exposed secrets (actual API keys and tokens)
echo "🔍 Checking for exposed secrets..."
if grep -r "sk_live_[a-zA-Z0-9]\{20,\}\|sk_test_[a-zA-Z0-9]\{20,\}\|aisensy_[a-zA-Z0-9]\{20,\}" --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" app/ lib/ components/ 2>/dev/null; then
    echo "❌ Hardcoded API keys found in code"
    exit 1
else
    echo "✅ No hardcoded API keys found"
fi

# Check environment variables
echo "🔍 Checking environment configuration..."
if [ ! -f ".env.production" ]; then
    echo "❌ Missing .env.production file"
    exit 1
else
    echo "✅ Production environment file exists"
fi

# Check HTTPS enforcement
echo "🔍 Checking HTTPS configuration..."
if grep -q "NEXT_PUBLIC_BASE_URL=https" .env.production; then
    echo "✅ HTTPS enforced"
else
    echo "⚠️  Warning: HTTPS not enforced"
fi

# Check database security
echo "🔍 Checking database security..."
if grep -q "ROW LEVEL SECURITY\|ENABLE ROW LEVEL SECURITY" supabase/migrations/*.sql; then
    echo "✅ RLS policies found"
else
    echo "❌ Missing Row Level Security policies"
    exit 1
fi

echo "🔒 Security check completed"