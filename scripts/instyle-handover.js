const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:3000/api/generate-component';

const instyleBrandInfo = {
  name: 'Instyle Hair Boutique',
  colors: {
    primary: '#D946EF',
    secondary: '#FDF4FF',
    accent: '#A855F7',
    text: '#1F2937',
  },
  font: 'Poppins',
};

async function generateInstyleComponent() {
  console.log('Generating Instyle header component...');
  try {
    const response = await axios.post(API_URL, {
      componentType: 'header',
      brandInfo: instyleBrandInfo,
    });

    const { html, css } = response.data;

    fs.writeFileSync('./instyle-header.html', html);
    fs.writeFileSync('./instyle-header.css', css);

    console.log('Instyle header component generated successfully!');
  } catch (error) {
    console.error('Error generating Instyle component:', error.message);
  }
}

function createInstyleData() {
  console.log('Creating Instyle sample data...');
  const sampleData = {
    products: [
      { id: 1, name: 'Shampoo', price: 25000 },
      { id: 2, name: 'Conditioner', price: 25000 },
      { id: 3, name: 'Hair Mask', price: 35000 },
    ],
    services: [
      { id: 1, name: 'Haircut', price: 50000 },
      { id: 2, name: 'Coloring', price: 150000 },
      { id: 3, name: 'Blowout', price: 75000 },
    ],
  };

  fs.writeFileSync('./instyle-data.json', JSON.stringify(sampleData, null, 2));
  console.log('Instyle sample data created successfully!');
}

async function main() {
  await generateInstyleComponent();
  createInstyleData();
}

main();
