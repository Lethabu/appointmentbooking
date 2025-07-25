'use client';

import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function ClientsPage() {
  const supabase = createClientComponentClient();
  const [clients, setClients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error } = await supabase.from('clients').select('*');
        if (error) throw error;
        setClients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, [supabase]);

  if (loading) return <div>Loading clients...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Clients</h1>
      <p>Welcome to the clients page.</p>
      {clients && clients.length > 0 ? (
        <pre>{JSON.stringify(clients, null, 2)}</pre>
      ) : (
        <p>No clients found.</p>
      )}
    </div>
  );
}