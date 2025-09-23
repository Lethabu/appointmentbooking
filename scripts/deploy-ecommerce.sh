#!/bin/bash

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