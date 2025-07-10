import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get('salon_id');
  const serviceId = searchParams.get('service_id');
  const dateString = searchParams.get('date'); // YYYY-MM-DD

  if (!salonId || !serviceId || !dateString) {
    return NextResponse.json({ error: 'Missing required parameters: salon_id, service_id, date' }, { status: 400 });
  }

  const queryDate = new Date(dateString);
  if (isNaN(queryDate.getTime())) {
    return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
  }

  try {
    // 1. Fetch service duration
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('duration_minutes, buffer_before_minutes, buffer_after_minutes, service_resources(resource_id)')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      console.error('Error fetching service:', serviceError);
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    const serviceDuration = service.duration_minutes;
    const bufferBefore = service.buffer_before_minutes || 0;
    const bufferAfter = service.buffer_after_minutes || 0;
    const requiredResourceIds = service.service_resources.map(sr => sr.resource_id);

    // 2. Fetch staff schedules for the given salon and day
    
    

    // 3. Fetch existing appointments for the given salon and date
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999)).toISOString();

    const { data: existingAppointmentsRaw, error: appointmentsError } = await supabase
      .from('appointments')
      .select('start_time, service_id, staff_id, recurrence_rule, services(duration_minutes, buffer_before_minutes, buffer_after_minutes)')
      .eq('salon_id', salonId)
      .gte('start_time', startOfDay)
      .lte('start_time', endOfDay);

    if (appointmentsError) {
      console.error('Error fetching existing appointments:', appointmentsError);
      return NextResponse.json({ error: 'Error fetching existing appointments' }, { status: 500 });
    }

    const existingAppointments = [];

    // Expand recurring appointments for conflict checking
    for (const appt of existingAppointmentsRaw) {
      if (appt.recurrence_rule) {
        // For simplicity, expand for the next 30 days from the query date
        const maxRecurrenceDate = new Date(queryDate);
        maxRecurrenceDate.setDate(queryDate.getDate() + 30);

        let currentRecurrenceDate = new Date(appt.start_time);
        while (currentRecurrenceDate <= maxRecurrenceDate) {
          existingAppointments.push({
            ...appt,
            start_time: currentRecurrenceDate.toISOString(),
          });

          switch (appt.recurrence_rule) {
            case 'daily':
              currentRecurrenceDate.setDate(currentRecurrenceDate.getDate() + 1);
              break;
            case 'weekly':
              currentRecurrenceDate.setDate(currentRecurrenceDate.getDate() + 7);
              break;
            case 'monthly':
              currentRecurrenceDate.setMonth(currentRecurrenceDate.getMonth() + 1);
              break;
            default:
              currentRecurrenceDate = new Date(maxRecurrenceDate.getTime() + 1); // Exit loop
              break;
          }
        }
      } else {
        existingAppointments.push(appt);
      }
    }

    // --- Availability Calculation Logic ---
    const availableSlots = [];

    // Fetch salon's opening and closing times
    const { data: salonData, error: salonError } = await supabase
      .from('salons')
      .select('opening_time, closing_time')
      .eq('id', salonId)
      .single();

    if (salonError || !salonData) {
      console.error('Error fetching salon hours:', salonError);
      return NextResponse.json({ error: 'Salon not found or hours not set' }, { status: 404 });
    }

    const [openHour] = salonData.opening_time.split(':').map(Number);
    const [closeHour, closeMinute] = salonData.closing_time.split(':').map(Number);

    const intervalMinutes = 30; // Check every 30 minutes

    // Iterate through potential slots within salon's working hours
    for (let hour = openHour; hour <= closeHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const slotStart = new Date(queryDate);
        slotStart.setHours(hour, minute, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60 * 1000);

        // Proposed slot with buffers
        const proposedSlotStartWithBuffer = new Date(slotStart.getTime() - bufferBefore * 60 * 1000);
        const proposedSlotEndWithBuffer = new Date(slotEnd.getTime() + bufferAfter * 60 * 1000);

        // Skip if slot ends after closing time
        const closingTime = new Date(queryDate);
        closingTime.setHours(closeHour, closeMinute, 0, 0);
        if (slotEnd > closingTime) continue;

        let isSlotAvailable = false;
        let availableStaffId = null;

        // Check each staff member for availability
        for (const staffSchedule of staffWorkingHours) {
          // Skip staff on day off
          if (dayOffStaffIds.includes(staffSchedule.staff_id)) continue;

          const staffWorkingStart = new Date(queryDate);
          staffWorkingStart.setHours(parseInt(staffSchedule.start_time.substring(0, 2)), parseInt(staffSchedule.start_time.substring(3, 5)), 0, 0);
          const staffWorkingEnd = new Date(queryDate);
          staffWorkingEnd.setHours(parseInt(staffSchedule.end_time.substring(0, 2)), parseInt(staffSchedule.end_time.substring(3, 5)), 0, 0);

          // Check if slot is within staff's working hours
          if (slotStart >= staffWorkingStart && slotEnd <= staffWorkingEnd) {
            // Check for staff breaks
            const isOnBreak = staffBreaks.some(b => {
              if (b.staff_id !== staffSchedule.staff_id) return false;
              const breakStart = new Date(queryDate);
              breakStart.setHours(parseInt(b.start_time.substring(0, 2)), parseInt(b.start_time.substring(3, 5)), 0, 0);
              const breakEnd = new Date(queryDate);
              breakEnd.setHours(parseInt(b.end_time.substring(0, 2)), parseInt(b.end_time.substring(3, 5)), 0, 0);

              return (slotStart < breakEnd && slotEnd > breakStart);
            });

            if (isOnBreak) continue; // Skip if staff is on break during this slot

            // Check for overlaps with existing appointments for this staff member
            const isOverlapping = existingAppointments.some(appt => {
              // Assuming existing appointments have a staff_id and service_id
              // For now, we'll just check if the time slot overlaps with any existing appointment
              // A more robust solution would fetch the service duration for each existing appointment
              // and check for overlaps with that specific appointment's end time.
              const apptStartTime = new Date(appt.start_time);
              const existingApptDuration = appt.services?.duration_minutes || serviceDuration;

              return (
                (slotStart < apptEndTime && slotEnd > apptStartTime)
              );
            });

            if (!isOverlapping) {
              // Check for resource conflicts
              const isResourceConflict = existingAppointments.some(appt => {
                const apptStartTime = new Date(appt.start_time);
                const existingApptDuration = appt.services?.duration_minutes || 0;
                const existingApptBufferBefore = appt.services?.buffer_before_minutes || 0;
                const existingApptBufferAfter = appt.services?.buffer_after_minutes || 0;

                const apptStartWithBuffer = new Date(apptStartTime.getTime() - existingApptBufferBefore * 60 * 1000);
                const apptEndWithBuffer = new Date(apptStartTime.getTime() + existingApptDuration * 60 * 1000 + existingApptBufferAfter * 60 * 1000);

                // Check if the proposed slot with its buffers overlaps with an existing appointment's buffered time
                const timeOverlap = (proposedSlotStartWithBuffer < apptEndWithBuffer && proposedSlotEndWithBuffer > apptStartWithBuffer);

                if (timeOverlap) {
                  // Check if any required resource for the current service is used by the existing appointment
                  const existingApptResourceIds = appt.services?.service_resources.map(sr => sr.resource_id) || [];
                  return requiredResourceIds.some(resourceId => existingApptResourceIds.includes(resourceId));
                }
                return false;
              });

              if (!isResourceConflict) {
                isSlotAvailable = true;
                availableStaffId = staffSchedule.staff_id;
                break; // Found an available staff member and resources for this slot
              }
            }
          }
        }

        if (isSlotAvailable) {
          availableSlots.push({ time: slotStart.toISOString(), staff_id: availableStaffId });
        }
      }
    }

    return NextResponse.json({ available_slots: availableSlots });

  } catch (error) {
    console.error('Error in availability API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
