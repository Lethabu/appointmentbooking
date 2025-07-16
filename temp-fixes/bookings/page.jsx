'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr';
import Notification from '@/app/components/UI/Notification';

export default function BookingsPage() {
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null
  
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false)

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
      {loading ? (
        <div className="text-center py-4">Loading appointments...</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {new Date(appointment.scheduled_time).toLocaleTimeString()}
                </span>
                <span className={`badge-${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="mt-2">
                <p>Service: {appointment.services?.name}</p>
                <p>Client: {appointment.profiles?.full_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}