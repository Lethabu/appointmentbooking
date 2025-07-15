/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css'

interface Staff {
  id: string
  name: string
}

interface Service {
  id: string
  name: string
  duration: number
  staff: Staff[]
}

interface AvailabilitySlot {
  start: Date
  end: Date
}

export default function BookingWidget() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedStaff, setSelectedStaff] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [, setAvailableSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    axios.get('/api/services')
      .then(res => setServices(res.data))
      .catch(_err => setError('Failed to load services'))
  }, [])

  useEffect(() => {
    if (selectedService && selectedDate) {
      setLoading(true)
      axios.get(`/api/appointments/availability?service=${selectedService}&date=${selectedDate.toISOString()}`)
        .then(res => setAvailableSlots(res.data))
        .catch(_err => setError('Failed to load availability'))
        .finally(() => setLoading(false))
    }
  }, [selectedService, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !selectedStaff || !selectedDate) {
      setError('Please fill all fields')
      return
    }
    
    setLoading(true)
    axios.post('/api/appointments', {
      service: selectedService,
      staff: selectedStaff,
      date: selectedDate
    })
    .then(() => {
      setError('')
      setSelectedService('')
      setSelectedStaff('')
      setSelectedDate(null)
      setSuccess('Booking confirmed! Check your email for details.')
    })
    .catch(_err => setError('Booking failed'))
    .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4 relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </div>

        {selectedService && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Staff</label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select staff</option>
              {services.find(s => s.id === selectedService)?.staff.map((staff: Staff) => (
                <option key={staff.id} value={staff.id}>{staff.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Date & Time</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            inline
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  )
}