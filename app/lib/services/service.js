import prisma from '../../../lib/prisma';
import { serviceSchema } from '@/lib/validators';

export async function createService(data) {
  const validation = serviceSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.format());
  }

  const service = await prisma.service.create({
    data: validation.data,
  });

  return service;
}

export async function getServices() {
  return await prisma.service.findMany();
}

export async function getServiceById(id) {
  return await prisma.service.findUnique({
    where: { id },
  });
}

export async function updateService(id, data) {
  const validation = serviceSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.format());
  }

  return await prisma.service.update({
    where: { id },
    data: validation.data,
  });
}

export async function deleteService(id) {
  return await prisma.service.delete({
    where: { id },
  });
}
