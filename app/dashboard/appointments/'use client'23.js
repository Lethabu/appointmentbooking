'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { salon: salonIdentifier } = params
  const [salon, setSalon] = useState(null)
  const [services, setServices] = useState([])
  const [selectedServices, setSelectedServices] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingStep, setBookingStep] = useState('select_services') // select_services, enter_details, confirmed
  const [clientDetails, setClientDetails] = useState({ name: '', email: '', phone: '' })
  const [appointmentTime, setAppointmentTime] = useState('')
  const [isBooking, setIsBooking] = useState(false)

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
    if (!clientDetails.name || !clientDetails.email || !appointmentTime) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsBooking(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonIdentifier,
          serviceIds: Array.from(selectedServices),
          clientDetails,
          scheduledTime: appointmentTime,
          totalDuration: total.duration,
          totalPrice: total.price,
        }),
      })
      if (!response.ok) throw new Error('Booking failed. Please try again.')
      setBookingStep('confirmed')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsBooking(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading salon...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>
  }

  if (bookingStep === 'confirmed') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Booking Request Sent!</h1>
        <p className="text-lg text-gray-700">Thank you for your booking. The salon will confirm your appointment shortly. You will receive a confirmation via email.</p>
        <button onClick={() => router.push('/')} className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-lg">Back to Home</button>
      </div>
    )
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

      {selectedServices.size > 0 && bookingStep === 'select_services' && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg sticky bottom-4 border-t-2">
          <div className="flex justify-between items-center text-lg font-medium mb-4">
            <span>Total:</span>
            <span className="font-bold">{total.duration} min - R{(total.price / 100).toFixed(2)}</span>
          </div>
          <button
            onClick={() => setBookingStep('enter_details')}
            className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Select Time & Details
          </button>
        </div>
      )}

      {bookingStep === 'enter_details' && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Your Details & Preferred Time</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={clientDetails.name}
              onChange={(e) => setClientDetails(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={clientDetails.email}
              onChange={(e) => setClientDetails(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number (Optional)"
              value={clientDetails.phone}
              onChange={(e) => setClientDetails(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="datetime-local"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <div className="flex gap-4 mt-6">
            <button onClick={() => setBookingStep('select_services')} className="px-6 py-3 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
              Back to Services
            </button>
            <button onClick={handleBooking} disabled={isBooking} className="flex-grow px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {isBooking ? 'Sending Request...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}