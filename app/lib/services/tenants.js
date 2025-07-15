import { prisma } from '@/lib/prisma';

export async function createTenant(data) {
  const tenant = await prisma.tenant.create({
    data,
  });

  return tenant;
}

export async function getTenants() {
  return await prisma.tenant.findMany();
}

export async function getTenantById(id) {
  return await prisma.tenant.findUnique({
    where: { id },
  });
}

export async function updateTenant(id, data) {
  return await prisma.tenant.update({
    where: { id },
    data,
  });
}

export async function deleteTenant(id) {
  return await prisma.tenant.delete({
    where: { id },
  });
}
