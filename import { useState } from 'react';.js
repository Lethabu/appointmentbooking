import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export default function SignUpPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    const { error: signUpError } = await supabase.auth.signUp({
      email: e.target.email.value,
      password: e.target.password.value,
      options: {
        data: {
          full_name: e.target.full_name.value,
        },
        // This will redirect the user to the salon creation page after they confirm their email.
        emailRedirectTo: `${window.location.origin}/dashboard/create-salon`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      // A better user experience is to inform them to check their email.
      setMessage('Sign up successful! Please check your email to confirm your account and continue.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Create Your Account</h1>
      <p>Start your journey to a smarter salon.</p>
      <form onSubmit={handleSubmit}>
        <input name="full_name" placeholder="Full Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </form>
    </div>
  );
}