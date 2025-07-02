
'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Salon Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete booking, payment, and client management platform for modern salons
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition">
              Get Started
            </Link>
            <Link href="/login" className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Online Booking</h3>
            <p className="text-gray-600">24/7 online booking system with real-time availability</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">AI Assistant</h3>
            <p className="text-gray-600">Smart booking assistant that speaks multiple South African languages</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Payment Processing</h3>
            <p className="text-gray-600">Secure payments with Stripe, PayStack, and local South African options</p>
          </div>
        </div>

        {/* Client Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">Featured Salon</h2>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">InStyle Hair Boutique</h3>
            <p className="text-gray-600 mb-6">Professional hair styling and treatments</p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/instylehairboutique" 
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
              >
                Book Appointment
              </Link>
              <Link 
                href="/instylehairboutique/shop" 
                className="border border-pink-600 text-pink-600 px-6 py-2 rounded-lg hover:bg-pink-50 transition"
              >
                Shop Products
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Setup */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Salon Owner?</h3>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition">
              Dashboard
            </Link>
            <Link href="/dashboard/instyle-setup" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
              Setup InStyle Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
