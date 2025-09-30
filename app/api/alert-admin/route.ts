import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { type, error, context, booking, demo } = await request.json();

    let message = '';
    let priority = '🔵'; // Default blue

    switch (type) {
      case 'critical_error':
        priority = '🔴';
        message = `${priority} CRITICAL ERROR on ${process.env.NEXT_PUBLIC_SITE_URL}\n\nError: ${error}\nContext: ${JSON.stringify(context, null, 2)}`;
        break;

      case 'new_booking':
        priority = '🟢';
        message = `${priority} NEW BOOKING!\n\nClient: ${booking.clientName}\nService: ${booking.serviceId}\nDate: ${booking.scheduledTime}\nPhone: ${booking.clientPhone}`;
        break;

      case 'new_demo':
        priority = '🟡';
        message = `${priority} NEW DEMO REQUEST!\n\nName: ${demo.name}\nSalon: ${demo.salonName}\nEmail: ${demo.email}\nPhone: ${demo.phone}\n\nAction required within 2 hours!`;
        break;

      case 'daily_summary':
        priority = '📊';
        message = `${priority} DAILY SUMMARY\n\nBookings: ${context.bookings}\nDemo Requests: ${context.demos}\nRevenue: R${context.revenue}\nErrors: ${context.errors}`;
        break;
    }

    // Log to Firebase for tracking
    await addDoc(collection(db, 'admin_alerts'), {
      alertType: type,
      message: message,
      severity: priority,
      context: context || {},
      createdAt: serverTimestamp(),
    });

    console.log('Alert logged:', message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alert failed:', error);
    return NextResponse.json(
      { error: 'Failed to send alert' },
      { status: 500 },
    );
  }
}
