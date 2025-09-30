'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CreditCard, Smartphone } from 'lucide-react';

interface CheckoutProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  onSuccess: (orderId: string) => void;
}

export default function InstyleCheckout({ items, onSuccess }: CheckoutProps) {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
          items,
          customerData,
          paymentMethod,
          source: 'website'
        })
      });

      const result = await response.json();
      if (result.success) {
        if (result.payment_url) {
          window.location.href = result.payment_url;
        } else {
          onSuccess(result.order_id);
        }
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const orderViaWhatsApp = () => {
    const itemsList = items.map(item => 
      `${item.name} (x${item.quantity}) - R${(item.price / 100).toFixed(2)}`
    ).join('\n');
    
    const message = `Hi! I'd like to order:\n\n${itemsList}\n\nTotal: R${(total / 100).toFixed(2)}\n\nMy details:\nName: ${customerData.name}\nPhone: ${customerData.phone}\nAddress: ${customerData.address}`;
    
    const whatsappUrl = `https://wa.me/+27123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold">R{((item.price * item.quantity) / 100).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>R{(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={customerData.name}
                onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={customerData.phone}
                onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+27 123 456 789"
              />
            </div>
            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                value={customerData.address}
                onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter delivery address"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={paymentMethod === 'paystack' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('paystack')}
              className="h-16 flex flex-col items-center"
            >
              <CreditCard className="w-6 h-6 mb-1" />
              <span>Paystack</span>
              <Badge variant="secondary" className="text-xs">Card/EFT</Badge>
            </Button>
            <Button
              variant={paymentMethod === 'payfast' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('payfast')}
              className="h-16 flex flex-col items-center"
            >
              <Smartphone className="w-6 h-6 mb-1" />
              <span>PayFast</span>
              <Badge variant="secondary" className="text-xs">Instant EFT</Badge>
            </Button>
            <Button
              variant="outline"
              onClick={orderViaWhatsApp}
              className="h-16 flex flex-col items-center bg-green-50 hover:bg-green-100"
            >
              <MessageCircle className="w-6 h-6 mb-1 text-green-600" />
              <span>WhatsApp</span>
              <Badge variant="secondary" className="text-xs">Manual Order</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Button */}
      <div className="flex gap-4">
        <Button
          onClick={handleCheckout}
          disabled={loading || !customerData.name || !customerData.phone}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {loading ? 'Processing...' : `Pay R${(total / 100).toFixed(2)}`}
        </Button>
        <Button
          onClick={orderViaWhatsApp}
          variant="outline"
          size="lg"
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Order via WhatsApp
        </Button>
      </div>
    </div>
  );
}