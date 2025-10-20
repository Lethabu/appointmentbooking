import { NextRequest, NextResponse } from 'next/server';

export async function firebaseAuthMiddleware(req: NextRequest) {
  const authorization = req.headers.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const token = authorization.split('Bearer ')[1];
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const response = await fetch(new URL('/api/auth/verify-token', req.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { decodedToken } = await response.json();
    const tenantId = decodedToken.tenant_id;

    if (!tenantId) {
      return new NextResponse('Tenant ID not found in token', { status: 403 });
    }

    req.headers.set('x-tenant-id', tenantId);
    req.headers.set('x-user-id', decodedToken.uid);

    return NextResponse.next();
  } catch (error) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
