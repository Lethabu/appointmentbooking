const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const instyleProducts = [
  {
    name: 'Premium Hair Treatment Kit',
    description:
      'Complete hair treatment kit for healthy, shiny hair. Includes deep conditioning mask, repair serum, and styling cream.',
    price: 25000, // R250.00 in cents
    category: 'Treatment',
    image_urls: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    ],
    stock_quantity: 10,
    variants: { sizes: ['Standard'], colors: ['Natural'] },
  },
  {
    name: 'Professional Hair Extensions - 18 inch',
    description:
      'High-quality human hair extensions for volume and length. Available in multiple colors.',
    price: 45000, // R450.00 in cents
    category: 'Extensions',
    image_urls: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    ],
    stock_quantity: 5,
    variants: {
      lengths: ['18 inch', '20 inch', '22 inch'],
      colors: ['Black', 'Brown', 'Blonde'],
    },
  },
  {
    name: 'Styling Product Bundle',
    description:
      'Complete styling bundle with gel, mousse, heat protectant spray, and finishing serum.',
    price: 18000, // R180.00 in cents
    category: 'Styling',
    image_urls: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    ],
    stock_quantity: 15,
    variants: { types: ['Curly Hair', 'Straight Hair', 'All Hair Types'] },
  },
  {
    name: 'Maphondo Installation Kit',
    description:
      'Everything needed for professional Maphondo installation including tools and accessories.',
    price: 35000, // R350.00 in cents
    category: 'Installation',
    image_urls: [
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400',
    ],
    stock_quantity: 8,
    variants: { sizes: ['Small', 'Medium', 'Large'] },
  },
  {
    name: 'Hair Care Maintenance Set',
    description:
      'Monthly maintenance set with shampoo, conditioner, and leave-in treatment.',
    price: 15000, // R150.00 in cents
    category: 'Care',
    image_urls: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    ],
    stock_quantity: 20,
    variants: { types: ['Dry Hair', 'Oily Hair', 'Normal Hair'] },
  },
  {
    name: 'Keratin Treatment Kit',
    description:
      'Professional-grade keratin treatment for smooth, frizz-free hair.',
    price: 32000, // R320.00 in cents
    category: 'Treatment',
    image_urls: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    ],
    stock_quantity: 6,
    variants: { strengths: ['Light', 'Medium', 'Strong'] },
  },
];

async function seedProducts() {
  try {
    // Get InStyle salon ID
    const { data: salon } = await supabase
      .from('salons')
      .select('id')
      .eq('subdomain', 'instylehairboutique')
      .single();

    if (!salon) {
      console.error('InStyle salon not found');
      return;
    }

    console.log('Found InStyle salon:', salon.id);

    // Insert products
    const productsWithSalonId = instyleProducts.map((product) => ({
      ...product,
      salon_id: salon.id,
      is_active: true,
      stock_threshold: 5,
    }));

    const { data, error } = await supabase
      .from('products')
      .insert(productsWithSalonId)
      .select();

    if (error) {
      console.error('Error inserting products:', error);
      return;
    }

    console.log(
      `Successfully seeded ${data.length} products for InStyle Hair Boutique`,
    );
    console.log(
      'Products:',
      data.map((p) => ({
        name: p.name,
        price: `R${(p.price / 100).toFixed(2)}`,
      })),
    );
  } catch (error) {
    console.error('Seeding error:', error);
  }
}

seedProducts();
