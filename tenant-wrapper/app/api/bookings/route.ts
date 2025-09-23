// tenant-wrapper/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const booking = await request.json();
    
    console.log('📝 BOOKING SUBMISSION:', { tenantId, booking });
    
    // For now, just log and return success
    // In production, save to database and send notifications
    
    return NextResponse.json({ 
      success: true, 
      message: 'Booking submitted successfully',
      bookingId: `${tenantId}-${Date.now()}`
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Booking failed' },
      { status: 500 }
    );
  }
}
