import { prisma } from '@/lib/prisma';

export async function createPayment(data) {
  const payment = await prisma.payment.create({
    data,
  });

  return payment;
}

export async function getPayments() {
  return await prisma.payment.findMany();
}

export async function getPaymentById(id) {
  return await prisma.payment.findUnique({
    where: { id },
  });
}

export async function updatePayment(id, data) {
  return await prisma.payment.update({
    where: { id },
    data,
  });
}

export async function deletePayment(id) {
  return await prisma.payment.delete({
    where: { id },
  });
}
