import prisma from '../../../lib/prisma';
import { appointmentSchema } from '@/lib/validators';

export async function createAppointment(data) {
  const validation = appointmentSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.format());
  }

  return await prisma.$transaction(async (tx) => {
    const [service, staff] = await Promise.all([
      tx.service.findUnique({
        where: { id: data.serviceId },
        select: { id: true, duration: true },
      }),
      tx.staff.findUnique({
        where: { id: data.staffId },
        select: { id: true },
      }),
    ]);

    if (!service || !staff) {
      throw new Error('Service or staff not found');
    }

    const conflictingAppointment = await tx.appointment.findFirst({
      where: {
        staffId: data.staffId,
        scheduled_time: {
          lte: new Date(new Date(data.scheduled_time).getTime() + data.duration * 60000),
          gte: data.scheduled_time,
        },
      },
    });

    if (conflictingAppointment) {
      throw new Error('Time conflict with existing appointment');
    }

    const appointment = await tx.appointment.create({
      data: {
        ...validation.data,
        service: { connect: { id: service.id } },
        staff: { connect: { id: staff.id } },
      },
    });

    return appointment;
  });
}

export async function getAppointments() {
  return await prisma.appointment.findMany({
    include: { service: true, staff: true },
  });
}
