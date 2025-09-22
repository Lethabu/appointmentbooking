import { NextRequest, NextResponse } from 'next/server';

const SUPERSAAS_API_KEY = process.env.SUPERSAAS_API_KEY;
const SUPERSAAS_SALON_ID = process.env.SUPERSAAS_SALON_ID || 'instyle';

export async function POST(request: NextRequest) {
  try {
    if (!SUPERSAAS_API_KEY) {
      return NextResponse.json({ error: 'SuperSaaS API key not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { action, appointment } = body;

    // Handle different SuperSaaS webhook events
    switch (action) {
      case 'create':
        // New appointment created
        console.log('New appointment created:', appointment);
        // Here you can sync to your database, send notifications, etc.
        break;
      
      case 'update':
        // Appointment updated
        console.log('Appointment updated:', appointment);
        break;
      
      case 'delete':
        // Appointment cancelled
        console.log('Appointment cancelled:', appointment);
        break;
      
      default:
        console.log('Unknown action:', action);
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('SuperSaaS sync error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!SUPERSAAS_API_KEY) {
      return NextResponse.json({ error: 'SuperSaaS API key not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('schedule') || SUPERSAAS_SALON_ID;

    // Fetch appointments from SuperSaaS
    const response = await fetch(
      `https://www.supersaas.com/api/bookings.json?schedule=${scheduleId}&api_key=${SUPERSAAS_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`SuperSaaS API error: ${response.statusText}`);
    }

    const appointments = await response.json();
    
    return NextResponse.json({
      success: true,
      appointments,
      schedule: scheduleId,
    });
  } catch (error) {
    console.error('SuperSaaS fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}