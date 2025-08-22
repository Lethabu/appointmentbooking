import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { service_id, customer_name, customer_email, customer_phone, appointment_date, start_time } = await request.json();

    if (!service_id || !appointment_date || !start_time || !customer_name || !customer_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create or get customer
    const customer = await prisma.client.upsert({
      where: { email: customer_email },
      update: { name: customer_name, phone: customer_phone },
      create: { name: customer_name, email: customer_email, phone: customer_phone },
    });

    // Get service details for end time calculation
    const service = await prisma.service.findUnique({
      where: { id: service_id },
      select: { duration_minutes: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const startDateTime = new Date(`${appointment_date}T${start_time}`);
    const endDateTime = new Date(startDateTime.getTime() + (service.duration_minutes * 60000));

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        serviceId: service_id,
        staffId: 'clerk_user_id', // TODO: Replace with actual staff ID
        scheduled_time: startDateTime,
        duration: service.duration_minutes,
        clientEmail: customer.email,
        status: 'CONFIRMED',
      },
    });

    return NextResponse.json({ success: true, appointment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}