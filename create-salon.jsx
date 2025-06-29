'use client';

import { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce'; // You'll need to run: npm install use-debounce

export default function CreateSalonPage() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [salonName, setSalonName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [debouncedSubdomain] = useDebounce(subdomain, 500);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAvailability = async () => {
      if (debouncedSubdomain.length < 3) {
        setAvailability(null);
        return;
      }
      const { count } = await supabase
        .from('salons')
        .select('subdomain', { count: 'exact', head: true })
        .eq('subdomain', debouncedSubdomain);
      setAvailability(count === 0);
    };

    checkAvailability();
  }, [debouncedSubdomain, supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availability) {
      setError('Subdomain is not available or invalid.');
      return;
    }
    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('salons').insert({
      name: salonName,
      subdomain: subdomain,
      owner_id: user.id,
      plan: 'trial',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14-day trial
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      // Redirect to the main dashboard after successful creation
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Set Up Your Salon</h1>
      <p>This will be your home base. Choose a name and your unique web address.</p>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input value={salonName} onChange={(e) => setSalonName(e.target.value)} placeholder="Your Salon's Name (e.g., InStyle Hair Boutique)" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <div>
          <input value={subdomain} onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="your-salon-address" required style={{ padding: '8px' }} />
          <span style={{ marginLeft: '5px' }}>.appointmentbookings.co.za</span>
          {availability === false && <p style={{ color: 'red' }}>Not available</p>}
          {availability === true && <p style={{ color: 'green' }}>Available!</p>}
        </div>
        <button type="submit" disabled={loading || !availability} style={{ width: '100%', padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px' }}>
          {loading ? 'Creating...' : 'Create My Salon'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
}

