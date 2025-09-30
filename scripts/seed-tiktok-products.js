const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'tiktok_products.csv');
const csvData = fs.readFileSync(csvPath, 'utf8');

const rows = csvData.trim().split('\n').slice(1); // remove header

const tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'; // InStyle Hair Boutique tenant_id

const products = rows.map(row => {
  const [id, name, description, price] = row.split(',');
  return {
    id: `prod_tiktok_${id}`,
    tenant_id: tenantId,
    name: name.trim(),
    description: description.trim(),
    price_cents: parseFloat(price) * 100,
    category: 'Service', // Default category
    images: '[]',
    inventory: 100 // Default inventory
  };
});

const sql = `
-- Insert TikTok products for InStyle Hair Boutique
INSERT OR REPLACE INTO Product (id, tenant_id, name, description, price_cents, category, images, inventory) VALUES
${products.map(p => `('${p.id}', '${p.tenant_id}', '${p.name.replace(/'/g, "''")}', '${p.description.replace(/'/g, "''")}', ${p.price_cents}, '${p.category}', '${p.images}', ${p.inventory})`).join(',\n')};
`;

const outputPath = path.join(__dirname, '..', 'seed-tiktok-products.sql');
fs.writeFileSync(outputPath, sql);

console.log(`✅ TikTok product seed SQL generated: ${outputPath}`);
console.log(`📦 ${products.length} TikTok products ready for seeding`);
