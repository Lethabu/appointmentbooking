'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import DashboardOverview from '@/app/components/Dashboard/Overview';

export default function SalonDashboardPage({ params }) {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const { salonId } = params;

    const [user, setUser] = useState(null);
    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalonAndVerifyOwner = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

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
