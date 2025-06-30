'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function OrderCompletePage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId) {
      setError('No order ID found. Your order may not have been processed correctly.')
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/public/orders/${orderId}`)
        if (!res.ok) {
          throw new Error('Could not find your order details.')
        }
        const data = await res.json()
        setOrder(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold">Loading your order confirmation...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-50">
        <h1 className="text-2xl font-bold text-red-700">An Error Occurred</h1>
        <p className="text-red-600 mt-2">{error}</p>
        <Link href="/" className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg">
          Back to Homepage
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Thank You for Your Order!</h1>
        <p className="text-gray-600 mt-2">Your order has been placed successfully. A confirmation email has been sent to {order.customer_email}.</p>
        <p className="text-sm text-gray-500 mt-4">Order ID: <span className="font-mono">{order.id}</span></p>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <ul className="divide-y divide-gray-200">
          {order.order_items.map((item, index) => (
            <li key={index} className="flex items-center py-4">
              <Image src={item.products.image_urls?.[0] || '/placeholder-image.png'} alt={item.products.name} width={64} height={64} className="rounded-lg object-cover" />
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold">{item.products.name}</h3>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">R{(item.price_at_purchase * item.quantity / 100).toFixed(2)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-4 border-t text-right"><div className="text-2xl font-bold"><span>Total: </span><span>R{(order.total_amount / 100).toFixed(2)}</span></div></div>
      </div>

      <div className="mt-8 text-center"><Link href="/" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">Continue Shopping</Link></div>
    </div>
  )
}