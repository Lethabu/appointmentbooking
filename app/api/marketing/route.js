import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Marketing API endpoint is working!' });
}

export async function POST() {
  return NextResponse.json(
    { message: 'Marketing API endpoint is working!' },
    { status: 201 },
  );
}
