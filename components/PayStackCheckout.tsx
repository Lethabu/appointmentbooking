'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';

export default function PayStackCheckout() {
  const { total, items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleCheckout = async () => {
    if (!email || !phone) {
      alert('Please enter your email and phone number');
      return;
    }

    setLoading(true);
<<<<<<< HEAD

=======
    
>>>>>>> origin/feat/instyle-whitelabel
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
<<<<<<< HEAD
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price_cents: i.price_cents,
            quantity: i.quantity,
=======
          items: items.map(i => ({ 
            id: i.id, 
            name: i.name, 
            price_cents: i.price_cents,
            quantity: i.quantity 
>>>>>>> origin/feat/instyle-whitelabel
          })),
          tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
        }),
      });
<<<<<<< HEAD

      const data = await response.json();

=======
      
      const data = await response.json();
      
>>>>>>> origin/feat/instyle-whitelabel
      if (data.url) {
        // Redirect to PayStack
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
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
<<<<<<< HEAD
      <Button
        onClick={handleCheckout}
        disabled={loading || total === 0}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {loading
          ? 'Processing...'
          : `Pay R${(total / 100).toFixed(0)} with PayStack`}
      </Button>
    </div>
  );
}
=======
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
>>>>>>> origin/feat/instyle-whitelabel
