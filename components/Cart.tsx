'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import PayStackCheckout from './PayStackCheckout';

export default function Cart() {
  const { items, total, removeItem, updateQuantity, itemCount } = useCart();

  const formatPrice = (cents: number) => {
    return `R${(cents / 100).toFixed(0)}`;
  };

  if (itemCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛒 Cart
            <Badge variant="secondary">0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Your cart is empty</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🛒 Cart
          <Badge variant="secondary">{itemCount}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <p className="text-purple-600 font-bold">
                {formatPrice(item.price_cents)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateQuantity(item.id, Math.max(0, item.quantity - 1))
                }
              >
                -
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeItem(item.id)}
              >
                ×
              </Button>
            </div>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-xl text-purple-600">
              {formatPrice(total)}
            </span>
          </div>

          <PayStackCheckout />
        </div>
      </CardContent>
    </Card>
  );
}
