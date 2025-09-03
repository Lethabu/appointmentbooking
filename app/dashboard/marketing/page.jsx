'use client';

import React from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';

export default function MarketingPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const [marketingData, setMarketingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMarketingData() {
      try {
        const { data, error } = await supabase.from('marketing').select('*');
        if (error) throw error;
        setMarketingData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMarketingData();
  }, [supabase]);

  if (loading) return <div>Loading marketing data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Marketing</h1>
      <p>Welcome to the marketing page.</p>
      {marketingData && marketingData.length > 0 ? (
        <pre>{JSON.stringify(marketingData, null, 2)}</pre>
      ) : (
        <p>No marketing data found.</p>
      )}
    </div>
  );
}