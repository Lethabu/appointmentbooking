'use client';

import { useState, useEffect } from 'react';

export default function EnvTestPage() {
  const [envVars, setEnvVars] = useState({
    supabaseUrl: null,
    supabaseAnonKey: null,
  });

  useEffect(() => {
    setEnvVars({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Environment Variables Test</h1>
      <div className="mt-4">
        <p>
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {envVars.supabaseUrl || 'Not loaded'}
        </p>
        <p>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {envVars.supabaseAnonKey || 'Not loaded'}
        </p>
      </div>
    </div>
  );
}
