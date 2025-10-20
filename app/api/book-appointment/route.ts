import { NextRequest, NextResponse } from 'next/server'
import { setTenantContext } from '@/lib/supabase'
import { createPaystackPayment } from '@/lib/payments/south-african-gateways'
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

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    const {
      tenant,
      startTime,
      endTime,
      serviceId,
      staffId,
      clientName,
      clientEmail,
      clientPhone,
      clientNotes,
      paymentMethod,
      paymentAmount,
      paymentReference,
      paymentStatus = 'pending'
    } = body

    if (!tenant || !startTime || !serviceId || !clientName || !clientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Resolve tenant and set context
    const { data: tenantData } = await supabase
      .from('tenants')
      .select('id, salon_id, branding')
      .eq('slug', tenant)
      .single()

    if (!tenantData) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // await setTenantContext(tenantData.id) // Temporarily disabled

    const { data: service } = await supabase
      .from('services')
      .select('id, name, price, duration_minutes')
      .eq('id', serviceId)
      .eq('salon_id', tenantData.salon_id)
      .single()

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Create appointment
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        tenant_id: tenantData.id,
        salon_id: tenantData.salon_id,
        service_id: service.id,
        start_time: startTime,
        end_time: endTime,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        client_notes: clientNotes || '',
        staff_id: staffId || null,
        status: 'confirmed',
        payment_status: paymentStatus,
        payment_reference: paymentReference || null,
        amount_cents: paymentAmount || service.price * 100
      })
      .select()
      .single()

    if (error) {
      console.error('Appointment creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      )
    }

    // Handle payment if needed
    let paymentData = null
    if (paymentMethod === 'paystack' && !paymentReference) {
      const payment = await createPaystackPayment(
        service.price,
        clientEmail,
        `apt_${appointment.id}`,
        {
          appointment_id: appointment.id,
          tenant: tenant,
          service: service.name
        }
      )

      paymentData = payment
      await supabase
        .from('appointments')
        .update({ payment_reference: payment.reference })
        .eq('id', appointment.id)
    }

    // Send confirmation (simplified)
    await sendBookingConfirmation(appointment, service, tenantData)

    return NextResponse.json({
      success: true,
      appointment,
      payment: paymentData,
      nextUrl: paymentData ? paymentData.authorization_url : `/book/${tenant}/success?appointmentId=${appointment.id}`
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendBookingConfirmation(appointment: any, service: any, tenant: any) {
  // Implement email/SMS confirmation
  // This is a placeholder
  console.log(`Booking confirmed for ${appointment.client_name} at ${tenant.name}`)
}
