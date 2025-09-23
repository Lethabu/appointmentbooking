import { prisma } from '@/lib/prisma';

export async function createServiceStaff(data) {
  const serviceStaff = await prisma.serviceStaff.create({
    data,
  });

  return serviceStaff;
}

export async function getServiceStaffs() {
  return await prisma.serviceStaff.findMany();
}

export async function getServiceStaffById(id) {
  return await prisma.serviceStaff.findUnique({
    where: { id },
  });
}

export async function updateServiceStaff(id, data) {
  return await prisma.serviceStaff.update({
    where: { id },
    data,
  });
}

export async function deleteServiceStaff(id) {
  return await prisma.serviceStaff.delete({
    where: { id },
  });
}
