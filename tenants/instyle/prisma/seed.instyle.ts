// tenants/instyle/prisma/seed.instyle.ts
// This is a placeholder for the Prisma seed script for the InStyle tenant.
// It will contain idempotent upserts for initial data.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding InStyle tenant data...');
  // Add your seed data here, e.g.,
  // await prisma.product.upsert({
  //   where: { id: 'some-id' },
  //   update: {},
  //   create: {
  //     id: 'some-id',
  //     name: 'Example Product',
  //     priceCents: 10000,
  //     stock: 10,
  //     tenantId: 'instyle',
  //   },
  // });
  console.log('InStyle tenant data seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });