'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/app/utils/cartStore';

interface CheckoutFormProps {
  tenantId: string;
}

interface CartItem {
  id: string;
  price: number;
  name?: string;
  image_urls?: string[];
}

export default function CheckoutForm({ tenantId }: CheckoutFormProps) {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const cart = useCartStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart.items.map((item: CartItem) => ({
            id: item.id,
            price: item.price,
            quantity: 1,
          })),
          customerData,
          tenantId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = result.authorization_url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const total = cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.price,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Full Name"
            value={customerData.name}
            onChange={(e) =>
              setCustomerData({ ...customerData, name: e.target.value })
            }
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={customerData.email}
            onChange={(e) =>
              setCustomerData({ ...customerData, email: e.target.value })
            }
            required
          />
          <Input
            placeholder="Phone"
            value={customerData.phone}
            onChange={(e) =>
              setCustomerData({ ...customerData, phone: e.target.value })
            }
            required
          />
          <Input
            placeholder="Address"
            value={customerData.address}
            onChange={(e) =>
              setCustomerData({ ...customerData, address: e.target.value })
            }
          />

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>Total: R{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || cart.items.length === 0}
          >
            {loading ? 'Processing...' : 'Pay with Paystack'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
