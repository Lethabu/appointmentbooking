'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import DashboardOverview from '@/app/components/Dashboard/Overview';
import { CalendarDaysIcon, ClockIcon, UserIcon } from 'lucide-react'; // Import icons

export default function SalonDashboardPage({ params }) {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const { salonId } = params;

    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [appointmentError, setAppointmentError] = useState(null);

    useEffect(() => {
        const fetchSalonAndVerifyOwner = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            if (!salonId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            const { data: salonData, error: fetchError } = await supabase
                .from('salons')
                .select('*')
                .eq('id', salonId)
                .eq('owner_id', user.id)
                .single();

            if (fetchError || !salonData) {
                setError('You do not have permission to view this salon, or it does not exist.');
                setLoading(false);
                return;
            }

            setSalon(salonData);
            setLoading(false);
        };

        fetchSalonAndVerifyOwner();
    }, [salonId, supabase, router]);

    useEffect(() => {
        async function fetchUpcomingAppointments() {
            if (!salonId) return;

            setLoadingAppointments(true);
            setAppointmentError(null);
            try {
                const { data, error } = await supabase
                    .from('appointments')
                    .select(`
                        id,
                        scheduled_time,
                        status,
                        full_name,
                        email,
                        phone,
                        services (name, duration_minutes, price_cents)
                    `)
                    .eq('salon_id', salonId)
                    .gte('scheduled_time', new Date().toISOString()) // Only future appointments
                    .order('scheduled_time', { ascending: true });

                if (error) {
                    throw error;
                }
                setUpcomingAppointments(data || []);
            } catch (err) {
                setAppointmentError('Failed to load upcoming appointments.');
                console.error('Error fetching upcoming appointments:', err);
            } finally {
                setLoadingAppointments(false);
            }
        }

        fetchUpcomingAppointments();
    }, [salonId, supabase]);

    if (loading) {
        return <div className="text-center p-12">Loading Your Dashboard...</div>;
    }

    if (error) {
        return <div className="text-center p-12 text-red-500">{error}</div>;
    }

    if (!salon) {
        return <div className="text-center p-12">Salon not found.</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{salon.name}</h1>
                <p className="text-gray-600">Welcome to your dashboard!</p>
            </header>
            <DashboardOverview salonId={salon.id} />
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
                {loadingAppointments && <p>Loading appointments...</p>}
                {appointmentError && <p className="text-red-500">{appointmentError}</p>}
                {!loadingAppointments && !appointmentError && upcomingAppointments.length === 0 && (
                    <p>No upcoming appointments found.</p>
                )}
                {!loadingAppointments && !appointmentError && upcomingAppointments.length > 0 && (
                    <div className="space-y-4">
                        {upcomingAppointments.map(appointment => (
                            <AppointmentDisplayCard key={appointment.id} appointment={appointment} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function AppointmentDisplayCard({ appointment }) {
    const scheduledTime = new Date(appointment.scheduled_time);
    const formattedDate = scheduledTime.toLocaleDateString('en-ZA', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = scheduledTime.toLocaleTimeString('en-ZA', {
        hour: '2-digit', minute: '2-digit', hour12: false
    });

    const servicePrice = (appointment.services?.price_cents / 100).toLocaleString('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
    });

    return (
        <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{appointment.services?.name || 'N/A Service'}</h3>
                <p className="text-gray-600 flex items-center mt-1">
                    <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                    {appointment.full_name} ({appointment.email})
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                    <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                    {formattedTime} ({appointment.services?.duration_minutes || 'N/A'} min)
                </p>
            </div>
            <div className="text-right md:text-left">
                <p className="text-gray-700 font-medium flex items-center justify-end md:justify-start">
                    <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
                    {formattedDate}
                </p>
                <p className="text-lg font-bold text-green-600 mt-1">{servicePrice}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {appointment.status}
                </span>
            </div>
        </div>
    );
}
