'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/context/CartContext'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const [client, setClient] = useState({ name: '', email: '', phone: '', address: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    const salonId = cart.length > 0 ? cart[0].salon_id : null
    if (!salonId) {
      setError('Could not determine the salon for this order.')
      setIsProcessing(false)
      return
    }

    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salonId, clientDetails: client, cart, total }),
      })

      if (!orderRes.ok) throw new Error('Failed to create the order.')
      const orderData = await orderRes.json()

      const paymentRes = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.order.id,
          amount: total,
          returnUrl: `${window.location.origin}/order/complete?order_id=${orderData.order.id}`
        })
      })

      if (!paymentRes.ok) throw new Error('Failed to initiate payment.')
      const { url: paymentUrl } = await paymentRes.json()

      clearCart()
      router.push(paymentUrl)

    } catch (err) {
      setError(err.message)
      setIsProcessing(false)
    }
  }

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <button onClick={() => router.push('/')} className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-lg">Go Shopping</button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">1. Your Details</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" value={client.name} onChange={(e) => setClient({...client, name: e.target.value})} className="w-full p-3 border rounded-lg" required />
            <input type="email" placeholder="Email Address" value={client.email} onChange={(e) => setClient({...client, email: e.target.value})} className="w-full p-3 border rounded-lg" required />
            <input type="tel" placeholder="Phone Number" value={client.phone} onChange={(e) => setClient({...client, phone: e.target.value})} className="w-full p-3 border rounded-lg" />
            <textarea placeholder="Delivery Address" value={client.address} onChange={(e) => setClient({...client, address: e.target.value})} className="w-full p-3 border rounded-lg" rows={3} required />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">2. Order Summary</h2>
          <div className="space-y-2 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>R{(item.price * item.quantity / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg pt-4 border-t">
            <span>Total:</span>
            <span>R{(total / 100).toFixed(2)}</span>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <button type="submit" disabled={isProcessing} className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50">
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </form>
    </div>
  )
}