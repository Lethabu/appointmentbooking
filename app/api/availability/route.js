import { NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/services/availability';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');
    const serviceId = searchParams.get('serviceId');
    const date = searchParams.get('date');

    const slots = await getAvailableSlots(staffId, serviceId, date);
    return NextResponse.json(slots);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
