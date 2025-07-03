// app/api/webhooks/booking-confirmed/route.js
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  const { appointment_id } = await req.json()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  
  // Fetch appointment details
  const { data: appointment } = await supabase
    .from('appointments')
    .select(`
      id,
      start_time,
      client_name,
      client_phone,
      services(name),
      salons(name, whatsapp_enabled)
    `)
    .eq('id', appointment_id)
    .single()
  
  if (!appointment || !appointment.salons.whatsapp_enabled) {
    return NextResponse.json({ status: 'Skipped' })
  }
  
  // Schedule reminders
  const reminderTimes = [
    { hours: 24, message: '24-hour reminder' },
    { hours: 2, message: '2-hour reminder' }
  ]
  
  for (const reminder of reminderTimes) {
    const reminderTime = new Date(appointment.start_time)
    reminderTime.setHours(reminderTime.getHours() - reminder.hours)
    
    await supabase
      .from('reminder_queue')
      .insert({
        appointment_id: appointment.id,
        send_at: reminderTime.toISOString(),
        message: `${appointment.client_name}, your ${appointment.services.name} ` +
                 `at ${appointment.salons.name} is in ${reminder.hours} hours!`,
        phone: appointment.client_phone
      })
  }
  
  return NextResponse.json({ status: 'Scheduled' })
}

// Scheduled task runner (cron job)
// This would be triggered via Vercel cron or Supabase Edge Functions
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  
  const now = new Date().toISOString()
  
  // Get pending reminders
  const { data: reminders } = await supabase
    .from('reminder_queue')
    .select('*')
    .lte('send_at', now)
    .eq('sent', false)
    .limit(10)
  
  for (const reminder of reminders) {
    try {
      // Send via WhatsApp API (Twilio example)
      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`
          },
          body: new URLSearchParams({
            From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            To: `whatsapp:${reminder.phone}`,
            Body: reminder.message
          })
        }
      )
      
      if (twilioResponse.ok) {
        await supabase
          .from('reminder_queue')
          .update({ sent: true, sent_at: new Date().toISOString() })
          .eq('id', reminder.id)
      }
    } catch (error) {
      console.error('WhatsApp send failed:', error)
    }
  }
  
  return NextResponse.json({ processed: reminders.length })
}