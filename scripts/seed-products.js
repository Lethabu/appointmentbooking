const fs = require('fs');
const path = require('path');

// Create products data for direct database seeding
const products = [
  {
    id: 'prod_1',
    tenant_id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
    name: 'Premium Hair Treatment Kit',
    description: 'Complete hair treatment kit for healthy, shiny hair',
    price_cents: 25000,
    category: 'Treatment',
    images: '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"]',
    inventory: 10
  },
  {
    id: 'prod_2', 
    tenant_id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
    name: 'Professional Hair Extensions',
    description: 'High-quality hair extensions for volume and length',
    price_cents: 45000,
    category: 'Extensions',
    images: '["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400"]',
    inventory: 5
  },
  {
    id: 'prod_3',
    tenant_id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
    name: 'Styling Product Bundle',
    description: 'Complete styling bundle with gel, mousse, and spray',
    price_cents: 18000,
    category: 'Styling', 
    images: '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"]',
    inventory: 15
  }
];

// Generate SQL for direct insertion
const sql = `
-- Insert products for InStyle Hair Boutique
INSERT OR REPLACE INTO Product (id, tenant_id, name, description, price_cents, category, images, inventory) VALUES
${products.map(p => `('${p.id}', '${p.tenant_id}', '${p.name}', '${p.description}', ${p.price_cents}, '${p.category}', '${p.images}', ${p.inventory})`).join(',\n')};
`;

fs.writeFileSync(path.join(__dirname, '..', 'seed-products.sql'), sql);
console.log('✅ Product seed SQL generated: seed-products.sql');
console.log(`📦 ${products.length} products ready for seeding`);

module.exports = { products };