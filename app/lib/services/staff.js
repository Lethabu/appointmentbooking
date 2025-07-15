import { prisma } from '@/lib/prisma';
import { staffSchema } from '@/lib/validators';

export async function createStaff(data) {
  const validation = staffSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.format());
  }

  const staff = await prisma.staff.create({
    data: validation.data,
  });

  return staff;
}

export async function getStaff() {
  return await prisma.staff.findMany();
}

export async function getStaffById(id) {
  return await prisma.staff.findUnique({
    where: { id },
  });
}

export async function updateStaff(id, data) {
  const validation = staffSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.format());
  }

  return await prisma.staff.update({
    where: { id },
    data: validation.data,
  });
}

export async function deleteStaff(id) {
  return await prisma.staff.delete({
    where: { id },
  });
}
