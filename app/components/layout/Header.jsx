'use client';

import Link from 'next/link';
import { instyle_data } from '@/app/instyle-hair-boutique/data.js';

export default function Header() {
  const { name, booking_link } = instyle_data;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
              <span className="sr-only">{name}</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{name}</h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            <Link href={booking_link} className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
              Book Now
            </Link>
            <Link href="/instyle-hair-boutique/shop" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
              Shop
            </Link>
            <Link href={booking_link} className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700">
              Book an Appointment
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}