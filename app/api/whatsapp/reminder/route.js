import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(request) {
  try {
    const { appointment_id } = await request.json();

    const { data: appointment } = await supabase
      .from('appointments')
      .select(
        `
        id, appointment_date, start_time,
        customers(name, phone),
        services(name)
      `,
      )
      .eq('id', appointment_id)
      .single();

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 },
      );
    }

    const appointmentDateTime = new Date(
      `${appointment.appointment_date}T${appointment.start_time}`,
    );
    const reminders = [
      {
        send_at: new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000),
        message: `Hi ${appointment.customers.name}! Reminder: Your ${appointment.services.name} appointment at Instyle Hair Boutique is tomorrow at ${appointment.start_time}. See you soon! 💇♀️`,
      },
      {
        send_at: new Date(appointmentDateTime.getTime() - 2 * 60 * 60 * 1000),
        message: `Hi ${appointment.customers.name}! Your ${appointment.services.name} appointment is in 2 hours at ${appointment.start_time}. We're ready for you! ✨`,
      },
    ];

    for (const reminder of reminders) {
      await supabase.from('whatsapp_reminders').insert({
        appointment_id,
        phone: appointment.customers.phone,
        message: reminder.message,
        send_at: reminder.send_at.toISOString(),
        status: 'scheduled',
      });
    }

    return NextResponse.json({
      success: true,
      reminders_scheduled: reminders.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
