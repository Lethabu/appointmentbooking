"use client"

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr';
import Notification from '@/app/components/UI/Notification';

export default function BookingsPage() {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fetchAppointments = useCallback(async (date) => {
    try {
      setLoading(true)
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          scheduled_time,
          status,
          services (name),
          profiles (full_name, phone)
        `)
        .gte('scheduled_time', startOfDay.toISOString())
        .lte('scheduled_time', endOfDay.toISOString())
        .order('scheduled_time', { ascending: true })

      if (error) throw error
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setNotification({ message: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchAppointments(selectedDate)
  }, [selectedDate, fetchAppointments])

  const handleConfirm = async (id) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'confirmed' })
      .eq('id', id)
    if (error) {
      setNotification({ message: error.message, type: 'error' });
    } else {
      fetchAppointments(selectedDate) // Refresh list
    }
  }

  const handleSendWhatsApp = async (id) => {
    // This calls the webhook we designed earlier
    await fetch(`/api/webhooks/booking-confirmed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment_id: id })
    })
    setNotification({ message: 'WhatsApp reminder queued!', type: 'success' });
  }

  return (
    <>
      <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      {/* The rest of your JSX remains the same, just wrapped in a fragment */}
    </>
  )
}