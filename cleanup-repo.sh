#!/bin/bash
# cleanup-repo.sh
# InStyle Repository Cleanup Script
# Run this from project root: bash cleanup-repo.sh

set -e  # Exit on error

echo "🧹 InStyle Repository Cleanup Starting..."
echo "==============================================="

# Create backup branch
echo "📦 Creating backup branch..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
git checkout -b "backup-before-cleanup-$TIMESTAMP"
git push -u origin "backup-before-cleanup-$TIMESTAMP" 2>/dev/null || true

# Switch to main/master branch for cleanup
echo "🔄 Switching to main branch..."
git checkout main 2>/dev/null || git checkout master 2>/dev/null

# Create cleanup branch
echo "🌿 Creating cleanup branch..."
git checkout -b "cleanup-routing-conflicts-$TIMESTAMP"

echo ""
echo "🔍 Scanning for conflicts..."
echo "==============================================="

# Find duplicate index files
echo "📄 Duplicate index files:"
find . -name "index.*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*"

echo ""
echo "📄 Duplicate page files:"
find . -name "*page.*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*"

echo ""
echo "🗑️  Starting cleanup..."
echo "==============================================="

# Remove conflicting files (CAREFULLY!)
echo "Removing static index.html (should be in /public)..."
if [ -f "index.html" ]; then
    # Check if /public exists, create if not
    mkdir -p public
    # Move to public folder if it's a landing page
    if grep -q "Coming Soon" index.html 2>/dev/null; then
        echo "  → Moving to /public/landing.html"
        mv index.html public/landing.html
    else
        echo "  → Removing (conflicts with Next.js)"
        rm -f index.html
    fi
fi

# Remove duplicate index.js if index.jsx exists
if [ -f "pages/index.jsx" ] && [ -f "pages/index.js" ]; then
    echo "Removing pages/index.js (keeping index.jsx)..."
    rm -f pages/index.js
fi

# Fix schema filename typo
if [ -f "Shema sql.sql" ]; then
    echo "Fixing schema filename typo..."
    mv "Shema sql.sql" schema.sql
fi

# Check for duplicate supabase configs
echo ""
echo "Checking for duplicate Supabase configs..."
SUPABASE_FILES=$(find . -name "supabase.js" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*")
COUNT=$(echo "$SUPABASE_FILES" | wc -l)

if [ "$COUNT" -gt 1 ]; then
    echo "⚠️  Found multiple supabase.js files:"
    echo "$SUPABASE_FILES"
    echo ""
    echo "Please manually review and keep only /lib/supabase.js"
fi

# Check for duplicate agent files
echo ""
echo "Checking for duplicate agent files..."
AGENT_FILES=$(find . -name "*agent*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -type f)
echo "$AGENT_FILES"

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo ""
    echo "Creating .gitignore..."
    cat > .gitignore << 'EOL'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Production
.vercel

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
*.swp
*.swo
*~

# IDE
.vscode/
.idea/
*.iml

# Temporary files
*.tmp
.backup/
EOL
fi

# Create env.template if it doesn't exist
if [ ! -f ".env.template" ]; then
    echo ""
    echo "Creating .env.template..."
    cat > .env.template << 'EOL'
# Copy this file to .env.local and fill in your values
# NEVER commit .env.local to git!

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key-here

# WhatsApp Integration (Optional)
WHATSAPP_API_URL=https://api.yourprovider.com/send
WHATSAPP_API_TOKEN=your-whatsapp-token

# Stripe (Optional - disable for MVP)
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key

# Multi-tenant Mode (for future)
NEXT_PUBLIC_TENANT_MODE=single
NEXT_PUBLIC_DEFAULT_TENANT=instyle

# Environment
NODE_ENV=development
EOL
fi

echo ""
echo "✅ Cleanup Complete!"
echo "==============================================="

# Show what was changed
echo ""
echo "📊 Changes Summary:"
git status --short

echo ""
echo "📝 Next Steps:"
echo "1. Review the changes: git diff"
echo "2. Test locally: npm install && npm run dev"
echo "3. If everything works:"
echo "   git add ."
echo "   git commit -m 'chore: cleanup routing conflicts and duplicate files'"
echo "   git push -u origin cleanup-routing-conflicts-$TIMESTAMP"
echo ""
echo "4. Create PR to merge into main"
echo ""
echo "💡 Backup available at: backup-before-cleanup-$TIMESTAMP"
echo "",
