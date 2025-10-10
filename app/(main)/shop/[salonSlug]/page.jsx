'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase'; // Assuming supabase client is in lib

// A simple placeholder for a cart store/context
const useCartStore = () => {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => setCart(prevCart => [...prevCart, product]);
  return { cart, addToCart };
};

export default function SalonPage({ params }) {
  const { salonSlug } = params;
  const [salon, setSalon] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (!salonSlug) return;

    const supabase = createClient();

    async function fetchSalonData() {
      try {
        setLoading(true);
        // Fetch salon details
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('*')
          .eq('slug', salonSlug)
          .single();

        if (salonError) throw salonError;
        setSalon(salonData);

        // Fetch products for the salon
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('salon_id', salonData.id);

        if (productsError) throw productsError;
        setProducts(productsData);

      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSalonData();
  }, [salonSlug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!salon) return <div>Salon not found.</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">{salon.name}</h1>
      <p>{salon.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
            <button 
              onClick={() => addToCart(product)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}