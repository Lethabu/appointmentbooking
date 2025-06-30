import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const {
    salonIdentifier,
    serviceIds,
    clientDetails,
    scheduledTime,
    totalDuration,
    totalPrice
  } = await req.json()

  if (!salonIdentifier || !serviceIds || !clientDetails || !scheduledTime) {
    return new NextResponse('Missing required fields', { status: 400 })
  }

  // Use the service role key for backend operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    // 1. Find the salon
    const { data: salon } = await supabase
      .from('salons')
      .select('id')
      .or(`subdomain.eq.${salonIdentifier},custom_domain.eq.${salonIdentifier}`)
      .single()

    if (!salon) {
      return new NextResponse('Salon not found', { status: 404 })
    }

    // 2. Create the main appointment record
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        salon_id: salon.id,
        client_name: clientDetails.name,
        client_email: clientDetails.email,
        client_phone: clientDetails.phone,
        scheduled_time: scheduledTime,
        total_duration_minutes: totalDuration,
        total_price: totalPrice,
        status: 'pending' // Salons will confirm this
      })
      .select()
      .single()

    if (appointmentError) throw appointmentError

    // 3. Link the services to the appointment
    const appointmentServices = serviceIds.map(serviceId => ({
      appointment_id: appointment.id,
      service_id: serviceId,
    }))

    const { error: servicesError } = await supabase
      .from('appointment_services')
      .insert(appointmentServices)

    if (servicesError) {
      // If linking services fails, we should roll back the appointment creation.
      // For simplicity here we log, but in production you'd use a transaction.
      await supabase.from('appointments').delete().eq('id', appointment.id)
      throw servicesError
    }

    // TODO: Send confirmation email/SMS to client and notification to salon owner

    return NextResponse.json({ success: true, appointmentId: appointment.id })
  } catch (error) {
    console.error('Booking creation failed:', error)
    return new NextResponse('Internal Server Error: ' + error.message, { status: 500 })
  }
}