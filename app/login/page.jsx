'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: e.target.email.value,
      password: e.target.password.value,
    });

    setLoading(false);
    if (loginError) {
      setError(loginError.message);
      return;
    }
    router.push('/dashboard');
  };

  // Magic Link
  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: magicError } = await supabase.auth.signInWithOtp({
      email: e.target.magic_email.value,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (magicError) setError(magicError.message);
    else setError('Check your email for a magic link!');
  };

  // OAuth
  const handleOAuth = async (provider) => {
    setLoading(true);
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (oauthError) setError(oauthError.message);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Sign in to your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <form onSubmit={handleMagicLink} className="space-y-4 mt-4">
          <input
            id="magic_email"
            name="magic_email"
            type="email"
            required
            placeholder="Email for magic link"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <button type="submit" className="w-full py-2 px-4 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200">Send Magic Link</button>
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <button onClick={() => handleOAuth('google')} className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600">Sign in with Google</button>
          <button onClick={() => handleOAuth('github')} className="w-full py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900">Sign in with GitHub</button>
        </div>
        {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
