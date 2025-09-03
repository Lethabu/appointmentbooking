'use client';

import React from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase.from('settings').select('*').single();
        if (error) throw error;
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [supabase]);

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Settings</h1>
      <p>Welcome to the settings page.</p>
      {settings ? (
        <pre>{JSON.stringify(settings, null, 2)}</pre>
      ) : (
        <p>No settings found.</p>
      )}
    </div>
  );
}