'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';

export default function PayStackCheckout({ tenantId }: { tenantId: string }) {
  const { total, items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setError('');
    if (!email || !phone) {
      setError('Please enter your email and phone number.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/paystack/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          email,
          phone,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price_cents: i.price_cents,
            quantity: i.quantity,
          })),
          tenantId: tenantId,
        }),
      });
      const data = await response.json();
      if (data.url) {
        // Redirect to PayStack
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="tel"
        placeholder="Your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        onClick={handleCheckout}
        disabled={loading || total === 0}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {loading ? 'Processing...' : `Pay R${(total / 100).toFixed(0)} with PayStack`}
      </Button>
    </div>
  );
}
