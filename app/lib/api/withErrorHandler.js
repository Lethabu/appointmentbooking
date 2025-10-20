// app/lib/api/withErrorHandler.js
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function withErrorHandler(handler) {
  return async (req, params) => {
    try {
      return await handler(req, params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new NextResponse(JSON.stringify(error.issues), { status: 422 });
      }
      if (error.name === 'UnauthorizedError') {
        return new NextResponse('Unauthorized', { status: 401 });
      }
      console.error(error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  };
}
