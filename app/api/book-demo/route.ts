import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { validateAndSanitize, demoRequestSchema } from '@/lib/validation';
import { trackDemoRequest, trackError } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate and sanitize input
    const validation = validateAndSanitize(body, demoRequestSchema);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      phone,
      salonName,
      salonSize,
      currentSolution,
      message,
    } = validation.data;

    const demoRequest = {
      name,
      email,
      phone: phone || '',
      salonName,
      salonSize: salonSize || '',
      currentSolution: currentSolution || '',
      message: message || '',
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'demo_requests'), demoRequest);

    // Track the demo request
    trackDemoRequest({
      name,
      salonName,
      email,
      phone,
      source: 'landing_page',
    });

    return NextResponse.json({
      success: true,
      message: 'Demo request submitted successfully',
      id: docRef.id,
    });
  } catch (error) {
    console.error('Error processing demo request:', error);

    // Track the error
    trackError(error as Error, {
      severity: 'high',
      context: 'demo_request_submission',
    });

    return NextResponse.json(
      { error: 'Failed to process demo request' },
      { status: 500 },
    );
  }
}
