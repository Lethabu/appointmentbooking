'use client';

import { useEffect, useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import DashboardOverview from '@/components/Dashboard/Overview';

export default function SalonDashboardPage({ params }) {
    const user = useUser();
    const supabase = useSupabaseClient();
    const router = useRouter();
    const { salonId } = params;

    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !salonId) {
            if (user === null) {
              router.push('/login');
            }
            return;
        }

        const fetchSalonAndVerifyOwner = async () => {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('salons')
                .select('*')
                .eq('id', salonId)
                .eq('owner_id', user.id)
                .single();

            if (fetchError || !data) {
                setError('You do not have permission to view this salon, or it does not exist.');
                setLoading(false);
                return;
            }

            setSalon(data);
            setLoading(false);
        };

        fetchSalonAndVerifyOwner();

    }, [user, salonId, supabase, router]);

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
              {/* e.g., <AppointmentList salonId={salon.id} /> */}
              {/* e.g., <ServiceManager salonId={salon.id} /> */}
            </div>
        </div>
    );
}
