'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/ssr';

const ProductCard = ({ product }) => (
  <div className="border rounded-lg p-4 shadow-sm">
    {/* Assuming a placeholder for an image */}
    <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
    <h3 className="font-bold text-lg">{product.name}</h3>
    <p className="text-gray-600">{product.description}</p>
    <div className="flex justify-between items-center mt-4">
      <span className="font-bold text-xl">
        {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(product.price / 100)}
      </span>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
        Add to Cart
      </button>
    </div>
  </div>
);

export default function ShopPage({ params }) {
  const supabase = createClientComponentClient();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: salon, error: salonError } = await supabase
        .from('salons')
        .select('id')
        .eq('subdomain', params.salon)
        .single();

      if (salonError || !salon) {
        setError('Salon not found.');
        setLoading(false);
        return;
      }

      const { data, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('salon_id', salon.id);

      if (productsError) setError(productsError.message);
      else setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [supabase, params.salon]);

  if (loading) return <div className="text-center p-8">Loading products...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}