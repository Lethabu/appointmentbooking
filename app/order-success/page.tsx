'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Order {
  id: string;
  total: number;
  status: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams ? searchParams.get('order_id') : null;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading)
    return <div className="p-8 text-center">Loading order details...</div>;

  if (!orderId || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-600">Error</CardTitle>
              <p className="text-gray-600">Could not load order details.</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 pt-4">
                <Button asChild className="flex-1">
                  <Link href="/instylehairboutique">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
              Order Confirmed!
            </CardTitle>
            <p className="text-gray-600">Thank you for your purchase</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {order && (
              <>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Order Details</h3>
                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Total:</strong> R{(order.total / 100).toFixed(2)}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">What&apos;s Next?</h3>
                  <ul className="text-sm space-y-1">
                    <li>• We&apos;ll prepare your items for collection</li>
                    <li>• You&apos;ll receive a WhatsApp confirmation</li>
                    <li>• Visit us at InStyle Hair Boutique to collect</li>
                  </ul>
                </div>
              </>
            )}
            <div className="flex gap-4 pt-4">
              <Button asChild className="flex-1">
                <Link href="/instylehairboutique">Back to Home</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/instylehairboutique/shop">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
