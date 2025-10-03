import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
<<<<<<< HEAD
    const { service_id, customer, date, time, payment_reference } =
      await request.json();
=======
    const { service_id, customer, date, time, payment_reference } = await request.json();
>>>>>>> origin/feat/instyle-whitelabel

    const booking = {
      id: `booking_${Date.now()}`,
      tenant_id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
      service_id,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      appointment_date: date,
      appointment_time: time,
      status: 'confirmed',
      payment_reference,
<<<<<<< HEAD
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking confirmed successfully',
=======
      created_at: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking confirmed successfully'
>>>>>>> origin/feat/instyle-whitelabel
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create booking' },
<<<<<<< HEAD
      { status: 500 },
    );
  }
}
=======
      { status: 500 }
    );
  }
}
>>>>>>> origin/feat/instyle-whitelabel
