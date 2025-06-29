'use client';

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: e.target.email.value,
      password: e.target.password.value,
      options: {
        data: {
          full_name: e.target.full_name.value,
          role: 'owner' // Default role for new sign-ups
        }
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // On successful sign-up, Supabase sends a confirmation email.
      // The user is redirected to a page telling them to check their email.
      // For now, we'll redirect them to create their salon immediately.
      // In production, you'd have a "please confirm your email" page.
      router.push('/dashboard/create-salon');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Create Your Account</h1>
      <form onSubmit={handleSubmit}>
        <input name="full_name" placeholder="Full Name" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <input name="email" type="email" placeholder="Email" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <input name="password" type="password" placeholder="Password" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
}

