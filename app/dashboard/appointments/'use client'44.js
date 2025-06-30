'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function OrdersDashboardPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/dashboard/orders')
        if (!res.ok) {
          throw new Error('Failed to fetch orders. Please try again later.')
        }
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading orders...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-8">Incoming Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl text-gray-600">You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order.id.substring(0, 8)}</h2>
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.created_at).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="mb-4 border-t pt-4">
                <h3 className="font-semibold">Customer Details</h3>
                <p>{order.customer_name}</p>
                <p>{order.customer_email}</p>
                <p>{order.customer_address}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Items Ordered</h3>
                <ul className="divide-y divide-gray-200 border-t border-b">
                  {order.order_items.map((item, index) => (
                    <li key={index} className="flex items-center py-3">
                      <Image src={item.products?.image_urls?.[0] || '/placeholder-image.png'} alt={item.products?.name || 'Product Image'} width={60} height={60} className="rounded-md object-cover" />
                      <div className="ml-4 flex-grow"><p className="font-medium">{item.products?.name || 'Product not found'}</p><p className="text-sm text-gray-600">{item.quantity} x R{(item.price_at_purchase / 100).toFixed(2)}</p></div>
                      <p className="font-semibold">R{(item.quantity * item.price_at_purchase / 100).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-right mt-4"><p className="text-lg font-bold">Total: R{(order.total_amount / 100).toFixed(2)}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}