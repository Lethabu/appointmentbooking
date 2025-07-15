import { NextResponse } from 'next/server';
import { createAppointment, getAppointments } from '@/lib/services/booking';

export async function POST(request) {
  try {
    const body = await request.json();
    const appointment = await createAppointment(body);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const appointments = await getAppointments();
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
