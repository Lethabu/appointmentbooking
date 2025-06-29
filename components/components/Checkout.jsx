'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Checkout({ cart, salonId }) {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [client, setClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      // 1. Create order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          salon_id: salonId,
          customer_name: client.name,
          customer_email: client.email,
          customer_phone: client.phone,
          customer_address: client.address,
          total_amount: calculateTotal(),
          status: 'pending_payment'
        })
        .select()
        .single()
      if (orderError || !order) throw orderError || new Error('Order creation failed')

      // 2. Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      }))
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      // 3. Initiate payment (Paystack example)
      const response = await fetch('/api/payments/paystack/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.id,
          amount: order.total_amount,
          email: client.email
        })
      })
      const paystack = await response.json()
      if (!paystack.authorization_url) throw new Error(paystack.error || 'Payment initiation failed')

      // 4. Redirect to payment gateway
      router.push(paystack.authorization_url)
    } catch (error) {
      console.error('Checkout failed:', error)
      setIsProcessing(false)
      alert(error.message || 'Checkout failed. Please try again.')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Customer Details</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={client.name}
            onChange={(e) => setClient({...client, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={client.email}
            onChange={(e) => setClient({...client, email: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={client.phone}
            onChange={(e) => setClient({...client, phone: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Delivery Address"
            value={client.address}
            onChange={(e) => setClient({...client, address: e.target.value})}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="border rounded-lg p-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p>R{(item.price * item.quantity / 100).toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total:</span>
            <span>R{(calculateTotal() / 100).toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-primary text-white py-3 rounded-lg mt-6 hover:bg-primary-dark disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Pay with Paystack'}
          </button>
        </div>
      </div>
    </div>
  )
}
