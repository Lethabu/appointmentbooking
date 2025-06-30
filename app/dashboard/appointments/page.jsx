import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppointmentCard from './AppointmentCard'

async function getSalonForUser(supabase, userId) {
  const { data: salon, error } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', userId)
    .single()

  if (error) {
    console.error('Error fetching salon for appointments page:', error)
    return null
  }
  return salon
}

async function getUpcomingAppointments(supabase, salonId) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id,
      start_time,
      status,
      clients ( name ),
      services ( name, price )
    `)
    .eq('salon_id', salonId)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching upcoming appointments:', error)
    return []
  }
  return data
}

async function getPastAppointments(supabase, salonId) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id,
      start_time,
      status,
      clients ( name ),
      services ( name, price )
    `)
    .eq('salon_id', salonId)
    .lt('start_time', new Date().toISOString())
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching past appointments:', error)
    return []
  }
  return data
}

export default async function AppointmentsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const salon = await getSalonForUser(supabase, user.id)

  if (!salon) {
    // This case is handled by layout, but good to have as a safeguard
    redirect('/dashboard/create-salon')
  }

  const upcomingAppointments = await getUpcomingAppointments(supabase, salon.id)
  const pastAppointments = await getPastAppointments(supabase, salon.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your upcoming and past appointments.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingAppointments.map(app => (
              <AppointmentCard key={app.id} appointment={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-600 font-medium">No upcoming appointments.</p>
            <p className="text-sm text-gray-500 mt-1">New bookings will appear here.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">History</h2>
        {pastAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pastAppointments.map(app => (
              <AppointmentCard key={app.id} appointment={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-600 font-medium">No past appointments.</p>
            <p className="text-sm text-gray-500 mt-1">Completed appointments will appear here.</p>
          </div>
        )}
      </section>
    </div>
  )
}