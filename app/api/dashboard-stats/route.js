import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');

    const todaysBookings = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyAppointments = await prisma.appointment.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        service: true,
      },
    });

    const weeklyRevenue = weeklyAppointments.reduce((total, appointment) => {
      return total + (appointment.service?.price_cents || 0);
    }, 0);

    const totalClients = await prisma.client.count();

    return NextResponse.json({
      todays_bookings: todaysBookings,
      weekly_revenue: weeklyRevenue,
      total_clients: totalClients,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}