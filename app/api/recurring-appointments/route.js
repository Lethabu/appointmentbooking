import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
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
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { baseAppointment, recurrenceRule, endDate } = await req.json();

  if (!baseAppointment || !recurrenceRule || !endDate) {
    return NextResponse.json(
      {
        error:
          'Missing required parameters: baseAppointment, recurrenceRule, endDate',
      },
      { status: 400 },
    );
  }

  const appointmentsToInsert = [];
  let currentAppointmentDate = new Date(baseAppointment.start_time);
  const endRecurrenceDate = new Date(endDate);

  while (currentAppointmentDate <= endRecurrenceDate) {
    appointmentsToInsert.push({
      salon_id: baseAppointment.salon_id,
      service_id: baseAppointment.service_id,
      start_time: currentAppointmentDate.toISOString(),
      client_name: baseAppointment.client_name,
      client_phone: baseAppointment.client_phone,
      staff_id: baseAppointment.staff_id,
      status: 'scheduled',
      recurrence_rule: recurrenceRule, // Store the rule for reference
    });

    // Calculate next appointment date based on recurrence rule
    switch (recurrenceRule) {
      case 'daily':
        currentAppointmentDate.setDate(currentAppointmentDate.getDate() + 1);
        break;
      case 'weekly':
        currentAppointmentDate.setDate(currentAppointmentDate.getDate() + 7);
        break;
      case 'monthly':
        currentAppointmentDate.setMonth(currentAppointmentDate.getMonth() + 1);
        break;
      default:
        // For now, only single appointment if rule is not recognized
        currentAppointmentDate = new Date(endRecurrenceDate.getTime() + 1); // Exit loop
        break;
    }
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentsToInsert)
      .select();

    if (error) {
      console.error('Error inserting recurring appointments:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, appointments: data });
  } catch (error) {
    console.error('Exception in recurring appointments API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
