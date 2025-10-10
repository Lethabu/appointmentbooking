import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function createServerSupabaseClient() {
    const cookieStore = cookies();
  
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
            }
          },
        },
      }
    );
  }

export async function GET() {
  // Implementation for getting bookings
  return NextResponse.json({ message: 'Bookings endpoint' })
}

export async function POST(request: NextRequest) {
  const { client_name, client_phone, service_id, start_time } = await request.json()
  const supabase = createServerSupabaseClient()

  // Create booking logic
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        client_name,
        client_phone,
        service_id,
        start_time,
        status: 'scheduled'
      })
      .select()

    if (error) throw error

    // Send WhatsApp message
    await sendWhatsAppMessage({
      phone: client_phone,
      message: `Hi ${client_name}! Your booking for ${service_id} at ${start_time} has been confirmed. See you soon!`,
      tenantId: 'instylehairboutique'
    });

    return NextResponse.json({ success: true, booking: data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to create booking', details: errorMessage }, { status: 500 });
  }
}

async function sendWhatsAppMessage({ phone, message, tenantId }: {phone: string, message: string, tenantId: string}) {
  // Implementation for sending WhatsApp message
  console.log(`Sending message to ${phone}: ${message}`);
}
