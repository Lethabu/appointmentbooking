import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return new NextResponse('Missing token', { status: 400 });
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    return NextResponse.json({ decodedToken });
  } catch (error) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
