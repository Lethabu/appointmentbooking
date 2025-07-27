import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;

    // In a real application, you would add authentication and authorization checks here.
    // For now, we will just forward the message to the orchestrator.

    const orchestratorUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orchestrator`;

    const response = await fetch(orchestratorUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from orchestrator');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat proxy:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}