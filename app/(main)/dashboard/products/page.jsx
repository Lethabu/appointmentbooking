'use client';

import React from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [supabase]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <p>Welcome to the products page.</p>
      {products && products.length > 0 ? (
        <pre>{JSON.stringify(products, null, 2)}</pre>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
