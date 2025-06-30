'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// API fetching functions
const fetchServices = async () => {
  const res = await fetch('/api/dashboard/services')
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch services.')
  return res.json()
}

export default function ServicesPage() {
  const [isEditing, setIsEditing] = useState(null) // will hold service id
  const [formData, setFormData] = useState({
    name: '',
    duration_minutes: '',
    price: ''
  })

  const queryClient = useQueryClient()

  // Query for fetching services
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  })

  // Mutation for adding a new service
  const addServiceMutation = useMutation({
    mutationFn: async (newService) => {
      const res = await fetch('/api/dashboard/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to add service.')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      resetForm()
    },
  })

  // Mutation for updating a service
  const updateServiceMutation = useMutation({
    mutationFn: async (updatedService) => {
      const res = await fetch(`/api/dashboard/services/${updatedService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update service.')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      resetForm()
    },
  })

  // Mutation for deleting a service
  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId) => {
      const res = await fetch(`/api/dashboard/services/${serviceId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete service.')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })

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
    const body = {
      name: formData.name,
      duration_minutes: parseInt(formData.duration_minutes),
      price: Math.round(parseFloat(formData.price) * 100), // Store in cents
    }

    if (isEditing) {
      updateServiceMutation.mutate({ id: isEditing, ...body })
    } else {
      addServiceMutation.mutate(body)
    }
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
      deleteServiceMutation.mutate(serviceId)
    }
  }

  const isMutating = addServiceMutation.isPending || updateServiceMutation.isPending || deleteServiceMutation.isPending;

  if (error) {
    return <div className="p-6 max-w-4xl mx-auto text-red-600 bg-red-50 rounded-lg">
      Error: {error.message}
    </div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Services</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(addServiceMutation.error || updateServiceMutation.error) && <p className="text-red-500 text-sm">{(addServiceMutation.error || updateServiceMutation.error).message}</p>}
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Service Name (e.g., Ladies Cut)" className="w-full p-2 border rounded" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="duration_minutes" type="number" value={formData.duration_minutes} onChange={handleInputChange} placeholder="Duration (minutes)" className="w-full p-2 border rounded" required />
            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} placeholder="Price (R)" className="w-full p-2 border rounded" required />
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={isMutating} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
              {isMutating ? 'Saving...' : (isEditing ? 'Update Service' : 'Add Service')}
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
        {isLoading ? (
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
                    <button onClick={() => handleEdit(service)} disabled={isMutating} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50">Edit</button>
                    <button onClick={() => handleDelete(service.id)} disabled={isMutating} className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50">Delete</button>
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