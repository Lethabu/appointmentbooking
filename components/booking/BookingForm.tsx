'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Service {
  id: string;
  name: string;
  price_cents: number;
}

interface BookingFormProps {
  tenantId: string;
}

export default function BookingForm({ tenantId }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Fetch services would be here
  const supabase = createClientComponentClient();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError('Please log in to book.');
      setLoading(false);
      return;
    }

    // Simple form handling example
    const service = formData.get('service') as string;
    const time = formData.get('time') as string;
    const name = formData.get('name') as string;

    const { error: submitError } = await supabase
      .from('bookings')
      .insert({
        tenant_id: tenantId,
        service: service,
        scheduled_time: time,
        client_name: name,
        status: 'confirmed',
      });

    setLoading(false);
    if (submitError) {
      setError('Booking failed: ' + submitError.message);
    } else {
      router.push('/order-success');
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="service">Service</label>
        <select name="service" required>
          <option value="">Select a service</option>
          {/* Services would be mapped here */}
          <option value="haircut">Haircut</option>
        </select>
      </div>
      <div>
        <label htmlFor="time">Preferred Time</label>
        <input type="datetime-local" name="time" required />
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" required />
      </div>
      <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
