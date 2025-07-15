import prisma from '../../../lib/prisma';

export async function createAppointment(data) {
  const appointment = await prisma.appointment.create({
    data,
  });

  return appointment;
}

export async function getAppointments() {
  return await prisma.appointment.findMany();
}

export async function getAppointmentById(id) {
  return await prisma.appointment.findUnique({
    where: { id },
  });
}

export async function updateAppointment(id, data) {
  return await prisma.appointment.update({
    where: { id },
    data,
  });
}

export async function deleteAppointment(id) {
  return await prisma.appointment.delete({
    where: { id },
  });
}
