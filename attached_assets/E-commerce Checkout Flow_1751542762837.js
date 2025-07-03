// components/Checkout.jsx
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
      const { data: order } = await supabase
        .from('orders')
        .insert({
          salon_id: salonId,
          customer_name: client.name,
          customer_email: client.email,
          customer_phone: client.phone,
          customer_address: client.address,
          total: calculateTotal(),
          status: 'pending_payment'
        })
        .select()
        .single()
      
      // 2. Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
      
      await supabase.from('order_items').insert(orderItems)
      
      // 3. Initiate payment
      const { data: payment } = await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          amount: order.total,
          method: 'payflex',
          status: 'pending'
        })
        .select()
        .single()
      
      // 4. Redirect to payment gateway
      const paymentUrl = await initiatePayflexPayment(payment.id, order.total)
      router.push(paymentUrl)
      
    } catch (error) {
      console.error('Checkout failed:', error)
      setIsProcessing(false)
    }
  }
  
  const initiatePayflexPayment = async (paymentId, amount) => {
    // In production: Call Netcash/Payflex API
    const response = await fetch('/api/payments/create', {
      method: 'POST',
      body: JSON.stringify({ 
        payment_id: paymentId,
        amount,
        return_url: `${window.location.origin}/order/complete`
      })
    })
    
    const { url } = await response.json()
    return url
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
            {isProcessing ? 'Processing...' : 'Pay with Payflex'}
          </button>
        </div>
      </div>
    </div>
  )
}