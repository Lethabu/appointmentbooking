'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function BookingPage() {
  const params = useParams()
  const { salon: salonIdentifier } = params
  const [salon, setSalon] = useState(null)
  const [services, setServices] = useState([])
  const [selectedServices, setSelectedServices] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!salonIdentifier) return

    const fetchServices = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/public/services?salon=${salonIdentifier}`)
        if (!response.ok) {
          throw new Error('This salon could not be found.')
        }
        const data = await response.json()
        setSalon(data.salon)
        setServices(data.services || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [salonIdentifier])

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      const newSet = new Set(prev)
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId)
      } else {
        newSet.add(serviceId)
      }
      return newSet
    })
  }

  const calculateTotal = () => {
    let total = { duration: 0, price: 0 }
    services.forEach(service => {
      if (selectedServices.has(service.id)) {
        total.duration += service.duration_minutes
        total.price += service.price
      }
    })
    return total
  }

  const total = calculateTotal()

  const handleBooking = async () => {
    // Placeholder for booking logic which will be built out next
    alert(`Booking for ${Array.from(selectedServices).length} services. Total: R${(total.price / 100).toFixed(2)}`)
  }

  if (loading) {
    return <div className="p-8 text-center">Loading salon...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-2">Book an Appointment at</h1>
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">{salon?.name}</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Select Your Services</h3>
        <ul className="space-y-3">
          {services.length > 0 ? services.map(service => (
            <li key={service.id} className="flex items-center justify-between p-3 border rounded-lg transition-all hover:bg-gray-50">
              <label htmlFor={`service-${service.id}`} className="flex items-center cursor-pointer w-full">
                <input
                  id={`service-${service.id}`}
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedServices.has(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                />
                <span className="ml-4 flex-grow">
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-gray-500">{service.duration_minutes} min</p>
                </span>
                <span className="font-semibold text-gray-800">R{(service.price / 100).toFixed(2)}</span>
              </label>
            </li>
          )) : (
            <p className="text-gray-500">This salon has not listed any services yet.</p>
          )}
        </ul>
      </div>

      {selectedServices.size > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg sticky bottom-4 border-t">
          <h3 className="text-xl font-semibold mb-4">Your Selection</h3>
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Total Duration:</span>
            <span className="font-bold">{total.duration} min</span>
          </div>
          <div className="flex justify-between items-center text-lg font-medium mt-2">
            <span>Total Price:</span>
            <span className="font-bold">R{(total.price / 100).toFixed(2)}</span>
          </div>
          <button
            onClick={handleBooking}
            className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Proceed to Book
          </button>
        </div>
      )}
    </div>
  )
}