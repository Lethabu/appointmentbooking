import { prisma } from '@/lib/prisma';

export async function createBooking(data) {
  const booking = await prisma.booking.create({
    data,
  });

  return booking;
}

export async function getBookings() {
  return await prisma.booking.findMany();
}

export async function getBookingById(id) {
  return await prisma.booking.findUnique({
    where: { id },
  });
}

export async function updateBooking(id, data) {
  return await prisma.booking.update({
    where: { id },
    data,
  });
}

export async function deleteBooking(id) {
  return await prisma.booking.delete({
    where: { id },
  });
}
