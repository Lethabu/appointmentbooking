'use client'

import { useState, useEffect, useTransition } from 'react'
import { createSalon, checkSubdomainAvailability } from './actions'
import { useDebounce } from 'use-debounce'

const FormStatus = ({ type, message }) => {
  if (!message) return null
  const baseClasses = 'p-3 rounded-md text-sm'
  const typeClasses = {
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
  }
  return <p className={`${baseClasses} ${typeClasses[type]}`}>{message}</p>
}

export default function CreateSalonPage() {
  const [subdomain, setSubdomain] = useState('')
  const [debouncedSubdomain] = useDebounce(subdomain, 500)
  const [availability, setAvailability] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState('')

  useEffect(() => {
    async function checkAvailability() {
      if (!debouncedSubdomain) {
        setAvailability(null)
        return
      }
      setIsChecking(true)
      const result = await checkSubdomainAvailability(debouncedSubdomain)
      setAvailability(result)
      setIsChecking(false)
    }
    checkAvailability()
  }, [debouncedSubdomain])

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      const result = await createSalon(formData)
      if (result?.error) {
        setFormError(result.error.message)
      }
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 -m-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Set Up Your Salon
          </h1>
          <p className="mt-2 text-sm text-center text-gray-600">
            Let's get your business online. This will be your home base.
          </p>
        </div>
        <form action={handleSubmit} className="space-y-6">
          {formError && <FormStatus type="error" message={formError} />}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Salon Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., InStyle Hair Boutique"
            />
          </div>
          <div>
            <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
              Your Salon's Web Address
            </label>
            <div className="flex mt-1">
              <input
                id="subdomain"
                name="subdomain"
                type="text"
                required
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-grow block w-full min-w-0 px-3 py-2 border-gray-300 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., instyle-hair"
              />
              <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-l-0 border-gray-300 rounded-r-md bg-gray-50">.appointmentbookings.co.za</span>
            </div>
            {isChecking && <p className="mt-2 text-xs text-gray-500">Checking availability...</p>}
            {availability && !isChecking && <p className={`mt-2 text-xs ${availability.available ? 'text-green-600' : 'text-red-600'}`}>{availability.message}</p>}
          </div>
          <div>
            <button type="submit" disabled={isPending || !availability?.available} className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isPending ? 'Creating Salon...' : 'Create Salon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}