import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Initialize Supabase client for server-side operations
function createSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
}

export async function getAvailableAppointments(tenantId, { service_id, date }) {
  const supabase = createSupabaseClient()
  
  try {
    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .eq('tenant_id', tenantId)
      .single()

    if (serviceError || !service) {
      return { error: 'Service not found', available_slots: [] }
    }

    // Get existing appointments for the date
    const targetDate = date || new Date().toISOString().split('T')[0]
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('datetime')
      .eq('service_id', service_id)
      .eq('tenant_id', tenantId)
      .gte('datetime', `${targetDate}T00:00:00`)
      .lt('datetime', `${targetDate}T23:59:59`)

    if (appointmentsError) {
      return { error: 'Failed to fetch appointments', available_slots: [] }
    }

    // Generate available time slots (simplified logic)
    const bookedTimes = appointments?.map(apt => apt.datetime) || []
    const availableSlots = generateTimeSlots(targetDate, bookedTimes, service.duration || 60)

    return {
      service_name: service.name,
      date: targetDate,
      available_slots: availableSlots,
      message: `Found ${availableSlots.length} available slots for ${service.name} on ${targetDate}`
    }
  } catch (error) {
    console.error('Error getting available appointments:', error)
    return { error: 'Failed to get available appointments', available_slots: [] }
  }
}

export async function bookAppointment(tenantId, { service_id, datetime, client_name, client_phone }) {
  const supabase = createSupabaseClient()
  
  try {
    // Check if slot is still available
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('id')
      .eq('service_id', service_id)
      .eq('tenant_id', tenantId)
      .eq('datetime', datetime)
      .single()

    if (existingAppointment) {
      return { success: false, error: 'This time slot is no longer available' }
    }

    // Get or create customer
    let customerId = null
    if (client_phone) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', client_phone)
        .eq('tenant_id', tenantId)
        .single()

      if (existingCustomer) {
        customerId = existingCustomer.id
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: client_name,
            phone: client_phone,
            tenant_id: tenantId
          })
          .select('id')
          .single()

        if (customerError) {
          return { success: false, error: 'Failed to create customer record' }
        }
        customerId = newCustomer.id
      }
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        service_id,
        datetime,
        customer_id: customerId,
        tenant_id: tenantId,
        status: 'confirmed',
        notes: `Booked via AI assistant for ${client_name}`
      })
      .select('id')
      .single()

    if (appointmentError) {
      return { success: false, error: 'Failed to create appointment' }
    }

    return {
      success: true,
      appointment_id: appointment.id,
      message: `Appointment successfully booked for ${client_name} on ${new Date(datetime).toLocaleString()}`
    }
  } catch (error) {
    console.error('Error booking appointment:', error)
    return { success: false, error: 'Failed to book appointment' }
  }
}

export async function searchServices(tenantId, query) {
  const supabase = createSupabaseClient()
  
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('id, name, description, price, duration')
      .eq('tenant_id', tenantId)
      .ilike('name', `%${query}%`)
      .limit(10)

    if (error) {
      return { services: [], error: 'Failed to search services' }
    }

    return {
      services: services || [],
      message: `Found ${services?.length || 0} services matching "${query}"`
    }
  } catch (error) {
    console.error('Error searching services:', error)
    return { services: [], error: 'Failed to search services' }
  }
}

// Helper function to generate time slots
function generateTimeSlots(date, bookedTimes, serviceDuration) {
  const slots = []
  const startHour = 9 // 9 AM
  const endHour = 17 // 5 PM
  const slotInterval = 30 // 30 minutes

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotInterval) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const fullDateTime = `${date}T${timeString}:00`
      
      // Check if this slot is available
      const isBooked = bookedTimes.some(bookedTime => {
        const bookedDate = new Date(bookedTime)
        const slotDate = new Date(fullDateTime)
        return Math.abs(bookedDate.getTime() - slotDate.getTime()) < serviceDuration * 60 * 1000
      })

      if (!isBooked) {
        slots.push({
          time: timeString,
          datetime: fullDateTime,
          available: true
        })
      }
    }
  }

  return slots
}