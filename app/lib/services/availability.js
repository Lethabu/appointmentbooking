import { prisma } from '@/lib/prisma';

export async function getAvailableSlots(staffId, serviceId, date) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    include: {
      workingHours: true,
      timeOff: true,
      appointments: {
        where: {
          startTime: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  if (!staff) {
    throw new Error('Staff not found');
  }

  const workingHours = staff.workingHours.find(
    (wh) => wh.dayOfWeek === new Date(date).getDay()
  );

  if (!workingHours) {
    return [];
  }

  const slots = [];
  const slotDuration = service.duration;
  const bufferTime = service.bufferTime || 0;

  let currentTime = new Date(date);
  currentTime.setHours(workingHours.startTime.getHours(), workingHours.startTime.getMinutes(), 0, 0);

  const endTime = new Date(date);
  endTime.setHours(workingHours.endTime.getHours(), workingHours.endTime.getMinutes(), 0, 0);

  while (currentTime < endTime) {
    const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

    if (slotEnd <= endTime) {
      const isAvailable = await checkAvailability(staff, currentTime, slotEnd);
      if (isAvailable) {
        slots.push({
          startTime: currentTime.toISOString(),
          endTime: slotEnd.toISOString(),
        });
      }
    }

    currentTime = new Date(
      currentTime.getTime() + (slotDuration + bufferTime) * 60000
    );
  }

  return slots;
}

async function checkAvailability(staff, startTime, endTime) {
  const conflictingAppointments = staff.appointments.filter(
    (appointment) =>
      new Date(appointment.startTime) < endTime &&
      new Date(appointment.endTime) > startTime
  );

  const conflictingTimeOff = staff.timeOff.filter(
    (timeOff) =>
      new Date(timeOff.startDate) < endTime &&
      new Date(timeOff.endDate) > startTime
  );

  return conflictingAppointments.length === 0 && conflictingTimeOff.length === 0;
}
