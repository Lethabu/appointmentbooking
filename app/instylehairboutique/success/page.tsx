'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Thank you for your purchase! Your order has been confirmed and you
            will receive a confirmation email shortly.
          </p>

          <div className="space-y-2">
            <Button
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Link href="/instylehairboutique/shop">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/instylehairboutique">Back to Home</Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Need help? Contact us on WhatsApp or visit our salon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
