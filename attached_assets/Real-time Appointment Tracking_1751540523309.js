// components/Dashboard/AppointmentLiveView.jsx
'use client'
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function AppointmentLiveView({ salonId }) {
  const supabase = useSupabaseClient()
  const [appointments, setAppointments] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Initial fetch
    const fetchAppointments = async () => {
      const { data } = await supabase
        .from('appointments')
        .select(`
          id, start_time, end_time, status,
          clients(name, phone),
          services(name, duration),
          staff(name)
        `)
        .eq('salon_id', salonId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
      
      setAppointments(data || [])
    }
    
    fetchAppointments()
    
    // Realtime updates
    const channel = supabase
      .channel('appointments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `salon_id=eq.${salonId}`
      }, (payload) => {
        setAppointments(current => {
          const existing = current.find(a => a.id === payload.new.id)
          if (existing) {
            return current.map(a => a.id === payload.new.id ? payload.new : a)
          } else {
            return [...current, payload.new].sort((a, b) => 
              new Date(a.start_time) - new Date(b.start_time)
            )
          }
        })
      })
      .subscribe()

    // Update current time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    
    return () => {
      channel.unsubscribe()
      clearInterval(timer)
    }
  }, [salonId])

  return (
    <div className="space-y-4">
      {appointments.map(app => (
        <AppointmentCard 
          key={app.id}
          appointment={app}
          currentTime={currentTime}
        />
      ))}
    </div>
  )
}

// PostgreSQL function for appointment status
CREATE OR REPLACE FUNCTION update_appointment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'scheduled';
  ELSIF TG_OP = 'UPDATE' THEN
    -- Auto-update status based on time
    IF NEW.start_time <= NOW() AND NEW.end_time >= NOW() THEN
      NEW.status := 'in_progress';
    ELSIF NEW.end_time < NOW() THEN
      NEW.status := 'completed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointment_status_trigger
BEFORE INSERT OR UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_appointment_status();