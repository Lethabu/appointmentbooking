'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function ShopPage() {
  const params = useParams()
  const router = useRouter()
  const { salon: salonIdentifier } = params
  const [salon, setSalon] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!salonIdentifier) return

    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/public/products?salon=${salonIdentifier}`)
        if (!response.ok) {
          throw new Error('This salon could not be found or has no shop.')
        }
        const data = await response.json()
        setSalon(data.salon)
        setProducts(data.products || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [salonIdentifier])

  const handleAddToCart = (product) => {
    // Placeholder for cart logic which will be part of the checkout flow
    alert(`Added ${product.name} to cart!`)
  }

  if (loading) return <div className="p-8 text-center">Loading Shop...</div>
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Shop Products at</h1>
        <h2 className="text-3xl font-semibold text-indigo-600">{salon?.name}</h2>
        <Link href={`/${salonIdentifier}/book`} className="text-indigo-600 hover:text-indigo-800 hover:underline mt-4 inline-block">
          ← Back to Bookings
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-1 transition-transform duration-300">
              <div className="relative w-full h-64 bg-gray-200">
                <Image
                  src={product.image_urls?.[0] || '/placeholder-image.png'}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1 flex-grow">{product.description || 'No description available.'}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-indigo-700">R{(product.price / 100).toFixed(2)}</span>
                  <button onClick={() => handleAddToCart(product)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500">This salon has not listed any products for sale yet.</p>
          <p className="mt-2 text-gray-400">Please check back later!</p>
        </div>
      )}
    </div>
  )
}