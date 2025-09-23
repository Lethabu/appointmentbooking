const fs = require('fs');
const path = require('path');
const { products: mainProducts } = require('./seed-products.js');

// Read and parse TikTok products
const csvPath = path.join(__dirname, '..', 'tiktok_products.csv');
const csvData = fs.readFileSync(csvPath, 'utf8');
const rows = csvData.trim().split('\n').slice(1); // remove header

const tiktokProducts = rows.map(row => {
  const [id, name, description, price] = row.split(',');
  return {
    id: `prod_tiktok_${id}`,
    name: name.trim(),
    description: description.trim(),
    price_cents: parseFloat(price) * 100,
    images: '[]', 
    inventory: 100,
  };
});

const allProducts = [...mainProducts, ...tiktokProducts];

const catalogHeaders = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand'];

const catalogRows = allProducts.map(p => {
  const price = `${(p.price_cents / 100).toFixed(2)} ZAR`;
  const availability = p.inventory > 0 ? 'in stock' : 'out of stock';
  const image = (JSON.parse(p.images) || [])[0] || '';
  const link = `https://instylehairboutique.co.za/shop/product/${p.id}`;

  return [
    p.id,
    p.name.replace(/,/g, ''),
    p.description.replace(/,/g, ''),
    availability,
    'new',
    price,
    link,
    image,
    'InStyle Hair Boutique'
  ].join(',');
});

const catalogCsv = [catalogHeaders.join(','), ...catalogRows].join('\n');

const outputPath = path.join(__dirname, '..', 'whatsapp_catalog.csv');
fs.writeFileSync(outputPath, catalogCsv);

console.log(`✅ WhatsApp catalog CSV generated: ${outputPath}`);
console.log(`📦 ${allProducts.length} products included in the catalog.`);
