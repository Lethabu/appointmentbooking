'use client'

import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

export default function ServicesPage() {
  const supabase = useSupabaseClient()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(null) // will hold service id
  const [formData, setFormData] = useState({ name: '', duration: '', price: '' })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    const res = await fetch('/api/services')
    const data = await res.json()
    setServices(data)
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const url = isEditing ? `/api/services/${isEditing}` : '/api/services'
    const method = isEditing ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        duration_minutes: parseInt(formData.duration),
        price: parseFloat(formData.price) * 100, // Store in cents
      }),
    })

    resetForm()
    await fetchServices()
  }

  const handleEdit = (service) => {
    setIsEditing(service.id)
    setFormData({
      name: service.name,
      duration: service.duration_minutes,
      price: (service.price / 100).toFixed(2),
    })
  }

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setLoading(true)
      await fetch(`/api/services/${serviceId}`, { method: 'DELETE' })
      await fetchServices()
    }
  }

  const resetForm = () => {
    setIsEditing(null)
    setFormData({ name: '', duration: '', price: '' })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Services</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Service Name (e.g., Ladies Cut)"
            className="p-2 border rounded"
            required
          />
          <input
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Duration (minutes)"
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
          <div className="md:col-span-3 flex gap-4">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : (isEditing ? 'Update Service' : 'Add Service')}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Services</h2>
        {loading && services.length === 0 ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <p>You haven't added any services yet. Use the form above to get started.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {services.map(service => (
                <li key={service.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-gray-600">
                      {service.duration_minutes} min - R{(service.price / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(service)} className="text-sm text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(service.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}