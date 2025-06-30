"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import Link from "next/link";
import { useCartStore } from "../../utils/cartStore";

export default function ShopPage() {
  const params = useParams();
  const { salonSlug } = params;
  const [salon, setSalon] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCartStore();

  useEffect(() => {
    const fetchSalonAndProducts = async () => {
      setLoading(true);
      setError(null);
      const { data: salonData, error: salonError } = await supabase
        .from("salons")
        .select("id, name")
        .eq("slug", salonSlug)
        .single();
      if (salonError || !salonData) {
        setError("Salon not found");
        setLoading(false);
        return;
      }
      setSalon(salonData);
      const { data: productsData } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .eq("salon_id", salonData.id);
      setProducts(productsData || []);
      setLoading(false);
    };
    if (salonSlug) fetchSalonAndProducts();
  }, [salonSlug]);

  const handleAddToCart = (product) => {
    cart.addItem({ ...product, salonSlug });
    setCartOpen(true);
  };

  if (loading) return <div className="p-8 text-center">Loading shop...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shop at {salon.name}</h1>
      <div className="flex justify-end mb-4">
        <button
          className="btn"
          onClick={() => setCartOpen(true)}
        >
          Cart ({cart.items.filter((item) => item.salonSlug === salonSlug).length})
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded shadow p-4 flex flex-col items-center">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover mb-2 rounded" />
            )}
            <div className="font-semibold mb-1">{product.name}</div>
            <div className="mb-2">R{product.price}</div>
            <button className="btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
          <div className="bg-white w-80 h-full shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Cart</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-500">✕</button>
            </div>
            {cart.items.length === 0 ? (
              <div className="text-gray-500">Cart is empty.</div>
            ) : (
              <ul className="flex-1 overflow-y-auto mb-4">
                {cart.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center mb-2">
                    <span>{item.name}</span>
                    <span>R{item.price}</span>
                    <button onClick={() => cart.removeItem(item.id)} className="text-red-500 ml-2">Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between items-center mt-4">
              <button
                className="btn w-1/2 mr-2"
                onClick={() => {
                  setCartOpen(false);
                  window.location.href = `/checkout/${salonSlug}`;
                }}
                disabled={cart.items.filter((item) => item.salonSlug === salonSlug).length === 0}
              >
                Go to Checkout
              </button>
              <button
                className="btn w-1/2 bg-gray-200 text-gray-700"
                onClick={() => cart.clearCart()}
                disabled={cart.items.filter((item) => item.salonSlug === salonSlug).length === 0}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
