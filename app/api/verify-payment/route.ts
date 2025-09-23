import { NextRequest, NextResponse } from 'next/server';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';

export async function POST(request: NextRequest) {
  try {
    const { reference, appointmentId } = await request.json();

    const processPayment = httpsCallable(functions, 'processPayment');
    const result = await processPayment({ reference, appointmentId });

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 },
    );
  }
}
