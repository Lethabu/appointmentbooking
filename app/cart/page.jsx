'use client'

import { useCart } from '@/app/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart()

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <Link href="/" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {cart.map(item => (
              <li key={item.id} className="flex items-center py-4">
                <Image
                  src={item.image_urls?.[0] || '/placeholder-image.png'}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">R{(item.price / 100).toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 p-1 border rounded-md text-center"
                  />
                  <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-500 hover:text-red-700">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total:</span>
              <span>R{(total / 100).toFixed(2)}</span>
            </div>
            <div className="mt-6 text-right">
              <Link href="/checkout" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">Proceed to Checkout</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}