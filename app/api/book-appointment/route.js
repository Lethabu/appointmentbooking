import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const body = await request.json()
    const { service_id, datetime, client_name, client_phone, tenant_id } = body
    const finalTenantId = tenant_id || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'

    let customerId = null
    if (client_phone) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('tenant_id', finalTenantId)
        .eq('phone', client_phone)
        .single()

      if (existingCustomer) {
        customerId = existingCustomer.id
      } else {
        const { data: newCustomer } = await supabase
          .from('customers')
          .insert({
            tenant_id: finalTenantId,
            name: client_name,
            phone: client_phone
          })
          .select('id')
          .single()
        customerId = newCustomer?.id
      }
    }

    const { data: service } = await supabase
      .from('services')
      .select('price')
      .eq('id', service_id)
      .eq('tenant_id', finalTenantId)
      .single()

    const { data: appointment } = await supabase
      .from('appointments')
      .insert({
        tenant_id: finalTenantId,
        service_id,
        customer_id: customerId,
        datetime,
        price: service?.price || 0,
        status: 'confirmed'
      })
      .select('*')
      .single()

    return NextResponse.json({
      success: true,
      appointment_id: appointment?.id,
      message: 'Appointment booked successfully'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to book appointment' },
      { status: 500 }
    )
  }
}