#!/bin/bash

<<<<<<< HEAD
echo "🚀 Deploying E-Commerce Implementation..."

# 1. Seed products
echo "📦 Seeding products..."
node scripts/seed-ecommerce-products.js

# 2. Add database function for stock management
echo "🗄️ Adding database functions..."
npx supabase db push --db-url "$SUPABASE_DB_URL" <<EOF
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, quantity INT)
RETURNS VOID AS \$\$
BEGIN
  UPDATE products 
  SET stock_quantity = stock_quantity - quantity,
      sales_count = sales_count + quantity
  WHERE id = product_id;
END;
\$\$ LANGUAGE plpgsql;
EOF

# 3. Test API endpoints
echo "🧪 Testing API endpoints..."
curl -X GET "http://localhost:3000/api/products" \
  -H "x-tenant-id: instylehairboutique" \
  -s | jq '.[] | {name, price}'

# 4. Build and deploy
echo "🏗️ Building application..."
npm run build

echo "✅ E-Commerce deployment complete!"
echo "🛍️ Visit: http://localhost:3000/instylehairboutique/shop"
echo "💳 Test checkout with Paystack sandbox"
echo "📱 Social sync: POST /api/social-sync/tiktok"
=======
echo "🛍️ InStyle Hair Boutique - E-Commerce Deployment"
echo "================================================"

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install zustand nanoid

# Step 2: Build knowledge base
echo "🧠 Building AI knowledge base..."
node scripts/build-kb.js

# Step 3: Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Step 4: Migrate products
echo "🛍️ Migrating products..."
node scripts/migrate-products.js

# Step 5: Migrate SuperSaaS data
echo "🔄 Migrating SuperSaaS data..."
node scripts/migrate-supersaas.js

# Step 6: Build application
echo "🏗️ Building application..."
npm run build

# Step 7: Start application
echo "🌟 Starting InStyle E-Commerce..."
npm start

echo "✅ E-Commerce deployment completed!"
echo ""
echo "🌐 InStyle Hair Boutique E-Commerce is now live:"
echo "   - Main Site: https://instylehairboutique.co.za"
echo "   - Shop: https://instylehairboutique.co.za/shop"
echo "   - Booking: https://instylehairboutique.co.za/book/instylehairboutique"
echo ""
echo "🛍️ Features Available:"
echo "   ✅ Product catalog with cart"
echo "   ✅ PayStack ZAR checkout"
echo "   ✅ WhatsApp chatbot integration"
echo "   ✅ Abandoned cart automation"
echo "   ✅ AI sales assistant"
echo ""
echo "🤖 Chatbot Configuration:"
echo "   - Upload bots/instyle-sales.json to your chatbot platform"
echo "   - Configure WhatsApp webhook endpoints"
echo ""
echo "💳 Payment Setup:"
echo "   - Configure PAYSTACK_SECRET_KEY in environment"
echo "   - Test checkout flow"
>>>>>>> origin/feat/instyle-whitelabel
