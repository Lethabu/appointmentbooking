'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            AppointmentBookings
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/#features" className="text-gray-600 hover:text-indigo-600">Features</Link>
          <Link href="/#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</Link>
          <Link href="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
        </div>
        <div>
          <Link href="/signup" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
            Start Free Trial
          </Link>
        </div>
      </div>
    </nav>
  )
}