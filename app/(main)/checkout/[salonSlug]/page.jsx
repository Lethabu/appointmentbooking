"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import { useCartStore } from "../../utils/cartStore";

export default function CheckoutPage() {
  const params = useParams();
  const { salonSlug } = params;
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const cart = useCartStore();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchSalon = async () => {
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
      setLoading(false);
    };
    if (salonSlug) fetchSalon();
  }, [salonSlug]);

  useEffect(() => {
    setCartItems(cart.items.filter((item) => item.salonSlug === salonSlug));
  }, [cart.items, salonSlug]);

  const handleRemove = (id) => {
    cart.removeItem(id);
  };

  const handleCheckout = async () => {
    setProcessing(true);
    // Placeholder: In real app, call payment API and clear cart
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      cart.clearCart();
    }, 1500);
  };

  if (loading) return <div className="p-8 text-center">Loading checkout...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (success) return <div className="p-8 text-center text-green-600">Thank you for your purchase!</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout at {salon?.name}</h1>
      {cartItems.length === 0 ? (
        <div className="mb-6 text-gray-500">Your cart is empty.</div>
      ) : (
        <ul className="mb-6">
          {cartItems.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <span>R{item.price}</span>
              <button onClick={() => handleRemove(item.id)} className="text-red-500 ml-2">Remove</button>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold">Total:</div>
          <div className="font-bold">R{cartItems.reduce((sum, item) => sum + (item.price || 0), 0)}</div>
        </div>
      )}
      <button
        className="btn w-full"
        onClick={handleCheckout}
        disabled={processing || cartItems.length === 0}
      >
        {processing ? "Processing..." : `Pay Now${cartItems.length > 0 ? ` (R${cartItems.reduce((sum, item) => sum + (item.price || 0), 0)})` : ''}`}
      </button>
    </div>
  );
}
