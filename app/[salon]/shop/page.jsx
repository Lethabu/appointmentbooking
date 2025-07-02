'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/app/context/CartContext'

export default function ShopPage() {
  const params = useParams()
  const { addToCart } = useCart()
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
    addToCart(product)
    // In a real app, you might show a toast notification here
    alert(`Added ${product.name} to your cart!`)
  }

  if (loading) return <div className="p-8 text-center">Loading Shop...</div>
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <Link href={`/${salonIdentifier}`} className="inline-flex items-center text-pink-600 hover:text-pink-800 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {salon?.name}
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Premium Hair Products
            </h1>
            <p className="text-gray-600 text-lg">Professional salon-grade products for home care</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                <div className="relative w-full h-64 bg-gradient-to-br from-pink-100 to-purple-100">
                  <Image 
                    src={product.image_urls?.[0] || '/placeholder-image.png'} 
                    alt={product.name} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    className="transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white rounded-full p-2 shadow-md">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{product.description || 'Professional salon-grade product for optimal hair care.'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      R{(product.price / 100).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product)} 
                      className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon!</h3>
              <p className="text-gray-600 mb-6">We're curating the perfect collection of premium hair care products for you.</p>
              <Link href={`/${salonIdentifier}`} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300">
                Book an Appointment Instead
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}</div>
    </div>
  );
    </div>
  )
}