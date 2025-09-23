const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const INSTYLE_TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

const products = [
  {
    name: 'Premium Hair Treatment Kit',
    description: 'Complete hair treatment kit for healthy, shiny hair. Includes deep conditioning mask, repair serum, and styling cream.',
    price_cents: 25000, // R250
    category: 'Treatment',
    images: JSON.stringify(['/placeholder.jpg']),
    inventory: 10
  },
  {
    name: 'Professional Hair Extensions - 18 inch',
    description: 'High-quality human hair extensions for volume and length. Available in multiple colors.',
    price_cents: 45000, // R450
    category: 'Extensions',
    images: JSON.stringify(['/placeholder.jpg']),
    inventory: 5
  },
  {
    name: 'Styling Product Bundle',
    description: 'Complete styling bundle with gel, mousse, heat protectant spray, and finishing serum.',
    price_cents: 18000, // R180
    category: 'Styling',
    images: JSON.stringify(['/placeholder.jpg']),
    inventory: 15
  },
  {
    name: 'Maphondo Installation Kit',
    description: 'Everything needed for professional Maphondo installation including tools and accessories.',
    price_cents: 35000, // R350
    category: 'Installation',
    images: JSON.stringify(['/placeholder.jpg']),
    inventory: 8
  },
  {
    name: 'Hair Care Maintenance Set',
    description: 'Monthly maintenance set with shampoo, conditioner, and leave-in treatment.',
    price_cents: 15000, // R150
    category: 'Care',
    images: JSON.stringify(['/placeholder.jpg']),
    inventory: 20
  }
];

async function migrateProducts() {
  try {
    console.log('🛍️ Migrating InStyle products...');
    
    // Ensure tenant exists
    const { data: tenant } = await supabase
      .from('tenants')
      .upsert({
        id: INSTYLE_TENANT_ID,
        name: 'InStyle Hair Boutique',
        slug: 'instylehairboutique',
        subdomain: 'instylehairboutique',
        brand: {
          primary: '#8b5cf6',
          secondary: '#f59e0b',
          logo: '/tenants/instyle/logo.png'
        }
      }, { onConflict: 'id' })
      .select()
      .single();

    console.log('✅ Tenant verified');

    // Insert products
    const productsWithTenant = products.map(product => ({
      ...product,
      tenant_id: INSTYLE_TENANT_ID
    }));

    const { data: insertedProducts, error } = await supabase
      .from('products')
      .upsert(productsWithTenant, { onConflict: 'name,tenant_id' })
      .select();

    if (error) throw error;

    console.log(`✅ Migrated ${insertedProducts?.length || 0} products`);
    
    // Display products
    insertedProducts?.forEach(product => {
      console.log(`   - ${product.name}: R${product.price_cents / 100} (${product.inventory} in stock)`);
    });

    console.log('\n🎉 Product migration completed successfully!');
    console.log('🌐 Shop now available at: https://instylehairboutique.co.za/shop');
    
    return insertedProducts;
    
  } catch (error) {
    console.error('❌ Product migration failed:', error);
    throw error;
  }
}

if (require.main === module) {
  migrateProducts();
}

module.exports = { migrateProducts };