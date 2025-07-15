import { prisma } from '@/lib/prisma';

export async function createTimeOff(data) {
  const timeOff = await prisma.timeOff.create({
    data,
  });

  return timeOff;
}

export async function getTimeOffs() {
  return await prisma.timeOff.findMany();
}

export async function getTimeOffById(id) {
  return await prisma.timeOff.findUnique({
    where: { id },
  });
}

export async function updateTimeOff(id, data) {
  return await prisma.timeOff.update({
    where: { id },
    data,
  });
}

export async function deleteTimeOff(id) {
  return await prisma.timeOff.delete({
    where: { id },
  });
}
