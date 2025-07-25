import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DashboardManagePage = () => {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name, duration_minutes, price')
          .eq('salon_id', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'); // Placeholder salon_id

        if (servicesError) throw servicesError;
        setServices(servicesData);

        // Fetch appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('id, scheduled_time, status, service_id, client_id, services(name), profiles(full_name)')
          .eq('salon_id', 'a1b2c3d4-e5f6-7890-1234-567890abcdef') // Placeholder salon_id
          .order('scheduled_time', { ascending: true });

        if (appointmentsError) throw appointmentsError;
        setAppointments(appointmentsData);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading dashboard data...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Salon Dashboard</h1>

      <h2>Services</h2>
      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Duration (minutes)</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{service.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{service.duration_minutes}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>R{(service.price / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Upcoming Appointments</h2>
      {appointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Client</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Service</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Scheduled Time</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{appointment.profiles?.full_name || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{appointment.services?.name || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(appointment.scheduled_time).toLocaleString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardManagePage;
