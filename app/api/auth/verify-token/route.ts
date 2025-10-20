import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase/server';

export async function POST(request: NextRequest) {
  try {
    if (!firebaseAdmin) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 });
    }

    const body = await request.json();
    const token = body?.token;

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    return NextResponse.json({ decodedToken }, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}