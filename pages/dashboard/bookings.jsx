import { useState, useEffect, useCallback } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import DashboardLayout from '@/components/Dashboard/Layout'

export default function BookingsPage() {
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

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
      alert(error.message)
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
    if (error) alert(error.message)
    else fetchAppointments(selectedDate) // Refresh list
  }

  const handleSendWhatsApp = async (id) => {
    // This calls the webhook we designed earlier
    await fetch(`/api/webhooks/booking-confirmed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment_id: id })
    })
    alert('WhatsApp reminder queued!')
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              ) : appointments.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(app.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{app.profiles?.full_name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{app.services?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{app.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {app.status !== 'confirmed' && <button onClick={() => handleConfirm(app.id)} className="text-indigo-600 hover:text-indigo-900">Confirm</button>}
                    <button onClick={() => handleSendWhatsApp(app.id)} className="text-green-600 hover:text-green-900">WhatsApp</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
