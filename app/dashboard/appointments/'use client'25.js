'use client'

import { useEffect, useState } from 'react'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({ name: '', price: '', stock_quantity: '' })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/products')
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to fetch products.')
      }
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        price: parseFloat(formData.price) * 100, // Store in cents
        stock_quantity: parseInt(formData.stock_quantity),
      }),
    })

    setFormData({ name: '', price: '', stock_quantity: '' })
    await fetchProducts()
  }

  if (error) {
    return <div className="p-6 max-w-4xl mx-auto text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name (e.g., Hair Oil)"
            className="p-2 border rounded"
            required
          />
          <input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price (R)"
            className="p-2 border rounded"
            required
          />
          <input
            name="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={handleInputChange}
            placeholder="Stock Quantity"
            className="p-2 border rounded"
            required
          />
          <div className="md:col-span-3">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Products</h2>
        {loading && products.length === 0 ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>You haven't added any products yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {products.map(product => (
                <li key={product.id} className="p-4 flex justify-between items-center">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    R{(product.price / 100).toFixed(2)} - Stock: {product.stock_quantity}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}