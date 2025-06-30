'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct, deleteProduct } from './actions'
import Image from 'next/image'
import { useRef } from 'react'

const fetchProducts = async () => {
  const res = await fetch('/api/dashboard/products')
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || 'Failed to fetch products')
  }
  return res.json()
}

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const formRef = useRef(null)

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      formRef.current?.reset()
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    createProductMutation.mutate(formData)
  }

  const isMutating = createProductMutation.isPending || deleteProductMutation.isPending

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add and manage the products you sell in your salon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-8">
            <h2 className="text-xl font-semibold mb-4">{createProductMutation.isPending ? 'Adding Product...' : 'Add New Product'}</h2>
            {createProductMutation.error && <p className="text-red-500 text-sm mb-4">Error: {createProductMutation.error.message}</p>}
            <form onSubmit={handleCreateSubmit} ref={formRef} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (R)</label>
                  <input type="number" name="price" id="price" step="0.01" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">Stock</label>
                  <input type="number" name="stock_quantity" id="stock_quantity" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
                <input type="file" name="image" id="image" accept="image/*" required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
              <button type="submit" disabled={isMutating} className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                Add Product
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Products</h2>
            {isLoading ? (
              <p>Loading products...</p>
            ) : error ? (<p className="text-red-500">Error: {error.message}</p>) : products.length > 0 ? (
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-md">
                    <div className="flex-shrink-0">
                      {product.image_urls && product.image_urls[0] ? (
                        <Image src={product.image_urls[0]} alt={product.name} width={64} height={64} className="w-16 h-16 object-cover rounded-md" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">No Img</div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{product.name || 'Unnamed Product'}</p>
                      <p className="text-sm text-gray-600">
                        {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format((product.price || 0) / 100)} • {product.stock_quantity || 0} in stock
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button onClick={() => { if(window.confirm('Are you sure you want to delete this product?')) { deleteProductMutation.mutate(product.id) }}} disabled={isMutating} className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-600 font-medium">You haven't added any products yet.</p>
                <p className="text-sm text-gray-500 mt-1">Use the form to add your first product.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}