import { prisma } from '@/lib/prisma';

export async function createLocation(data) {
  const location = await prisma.location.create({
    data,
  });

  return location;
}

export async function getLocations() {
  return await prisma.location.findMany();
}

export async function getLocationById(id) {
  return await prisma.location.findUnique({
    where: { id },
  });
}

export async function updateLocation(id, data) {
  return await prisma.location.update({
    where: { id },
    data,
  });
}

export async function deleteLocation(id) {
  return await prisma.location.delete({
    where: { id },
  });
}
