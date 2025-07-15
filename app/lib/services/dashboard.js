import prisma from '../../../lib/prisma';

export async function getDashboardStats(tenantId) {
  const totalBookings = await prisma.booking.count({
    where: { businessId: tenantId },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      businessId: tenantId,
      status: 'COMPLETED',
    },
  });

  const upcomingAppointments = await prisma.appointment.count({
    where: {
      businessId: tenantId,
      startTime: {
        gte: new Date(),
      },
    },
  });

  return {
    totalBookings,
    totalRevenue: totalRevenue._sum.amount || 0,
    upcomingAppointments,
  };
}

export async function getRecentBookings(tenantId) {
  return await prisma.booking.findMany({
    where: { businessId: tenantId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      appointment: {
        include: {
          service: true,
          staff: true,
        },
      },
    },
  });
}
