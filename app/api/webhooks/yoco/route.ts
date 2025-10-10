import { NextRequest, NextResponse } from 'next/server';
import { aisensy } from '@/lib/aisensy';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Create server-side Supabase client
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
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// You should implement webhook signature verification to ensure requests are from Yoco.
// This is a simplified placeholder.
async function verifyYocoSignature(request: NextRequest): Promise<boolean> {
    // const signature = request.headers.get('x-yoco-signature');
    // const secret = process.env.YOCO_WEBHOOK_SECRET;
    // Implement actual signature verification logic here.
    return true;
}

export async function POST(request: NextRequest) {
  try {
    // const isVerified = await verifyYocoSignature(request);
    // if (!isVerified) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const body = await request.json();
    if (body.type === 'payment.succeeded') {
      const reference = body.data.metadata.reference;
      const appointmentId = reference.split('-')[0];
      const supabase = createServerSupabaseClient();
      const { data: appointment, error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId)
        .select(
          `
          *,
          customer:customers(*),
          service:services(*),
          tenant:tenants(*)
        `,
        )
        .single();

      if (error || !appointment) {
        console.error('Failed to update appointment or appointment not found:', { appointmentId, error });
        // Potentially retry or alert.
        return NextResponse.json({ received: true, status: 'error', message: 'Appointment not found' });
      }

      if (appointment.customer?.phone) {
        await aisensy.sendMessage(
          appointment.customer.phone,
          `✅ Payment confirmed! Your ${appointment.service.name} appointment is booked for ${new Date(appointment.datetime).toLocaleDateString('en-ZA')}. See you soon! - ${appointment.tenant.name}`
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Yoco webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
