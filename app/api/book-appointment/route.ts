import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { validateAndSanitize, bookingSchema } from '@/lib/validation';
import { trackBooking, trackError } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate and sanitize input
    const validation = validateAndSanitize(body, bookingSchema);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 },
      );
    }

    const {
      serviceId,
      scheduledTime,
      clientName,
      clientPhone,
      clientEmail,
      tenantId,
    } = validation.data;

    const appointment = {
      serviceId,
      scheduledTime: Timestamp.fromDate(new Date(scheduledTime)),
      clientName,
      clientPhone,
      clientEmail,
      tenantId: tenantId || 'instyle-boutique',
      status: 'confirmed',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'appointments'), appointment);

    // Track the booking
    trackBooking({
      clientName,
      serviceId,
      scheduledTime,
      clientPhone,
      tenantId: tenantId || 'instyle-boutique',
      channel: 'website',
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully',
      appointmentId: docRef.id,
    });
  } catch (error) {
    console.error('Error booking appointment:', error);

    // Track the error
    trackError(error as Error, {
      severity: 'high',
      context: 'appointment_booking',
    });

    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 },
    );
  }
}
