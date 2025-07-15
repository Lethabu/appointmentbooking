import { prisma } from '@/lib/prisma';

export async function createUser(data) {
  const user = await prisma.user.create({
    data,
  });

  return user;
}

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}
