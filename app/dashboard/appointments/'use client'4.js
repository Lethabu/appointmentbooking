'use client'

import { useEffect, useState } from 'react'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(null) // will hold service id
  const [formData, setFormData] = useState({
    name: '',
    duration_minutes: '',
    price: ''
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/dashboard/services')
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to fetch services.')
      }
      const data = await res.json()
      setServices(data)
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

  const resetForm = () => {
    setIsEditing(null)
    setFormData({ name: '', duration_minutes: '', price: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const url = isEditing ? `/api/dashboard/services/${isEditing}` : '/api/dashboard/services'
    const method = isEditing ? 'PUT' : 'POST'

    const body = {
      name: formData.name,
      duration_minutes: parseInt(formData.duration_minutes),
      price: Math.round(parseFloat(formData.price) * 100), // Store in cents
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errData = await res.json()
      setError(errData.error || `Failed to ${isEditing ? 'update' : 'add'} service.`)
    } else {
      resetForm()
      await fetchServices()
    }
    setLoading(false)
  }

  const handleEdit = (service) => {
    setIsEditing(service.id)
    setFormData({
      name: service.name,
      duration_minutes: service.duration_minutes,
      price: (service.price / 100).toFixed(2),
    })
    window.scrollTo(0, 0)
  }

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setLoading(true)
      await fetch(`/api/dashboard/services/${serviceId}`, { method: 'DELETE' })
      await fetchServices()
      setLoading(false)
    }
  }

  if (error) {
    return <div className="p-6 max-w-4xl mx-auto text-red-600 bg-red-50 rounded-lg">Error: {error}</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Services</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Service Name (e.g., Ladies Cut)" className="w-full p-2 border rounded" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="duration_minutes" type="number" value={formData.duration_minutes} onChange={handleInputChange} placeholder="Duration (minutes)" className="w-full p-2 border rounded" required />
            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} placeholder="Price (R)" className="w-full p-2 border rounded" required />
          </div>
          <div className="flex gap-4">
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
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">You haven't added any services yet.</p>
            <p className="text-sm text-gray-500">Use the form above to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {services.map(service => (
                <li key={service.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-gray-600">
                      {service.duration_minutes} min - R{(service.price / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => handleEdit(service)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
                    <button onClick={() => handleDelete(service.id)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
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