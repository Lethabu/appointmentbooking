const { db } = require('../lib/firebase');
const { collection, addDoc, serverTimestamp } = require('firebase/firestore');

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Seed Services for InStyle Hair Boutique
    console.log('📋 Seeding services...');
    const services = [
      {
        name: 'Hair Extensions - Full Head',
        duration_minutes: 180,
        price: 120000, // in cents
        description: 'Premium Russian hair extensions, full head application',
        tenantId: 'instyle-boutique',
        category: 'extensions',
      },
      {
        name: 'Keratin Treatment',
        duration_minutes: 120,
        price: 85000,
        description: 'Smoothing keratin treatment for frizz-free hair',
        tenantId: 'instyle-boutique',
        category: 'treatments',
      },
      {
        name: 'Balayage Highlights',
        duration_minutes: 150,
        price: 75000,
        description: 'Hand-painted highlights for natural-looking color',
        tenantId: 'instyle-boutique',
        category: 'coloring',
      },
      {
        name: 'Wash, Cut & Blow Dry',
        duration_minutes: 60,
        price: 30000,
        description: 'Classic wash, cut and professional blow dry',
        tenantId: 'instyle-boutique',
        category: 'styling',
      },
    ];

    for (const service of services) {
      await addDoc(collection(db, 'services'), {
        ...service,
        createdAt: serverTimestamp(),
      });
    }
    console.log('✅ Services seeded successfully');

    // 2. Seed Demo Requests (for testing)
    console.log('📋 Seeding demo requests...');
    await addDoc(collection(db, 'demo_requests'), {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '+27821234567',
      salonName: 'Test Salon',
      message: 'Interested in AI booking system',
      status: 'completed',
      createdAt: serverTimestamp(),
    });
    console.log('✅ Demo requests seeded successfully');

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
