'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full text-center p-8">
        <CheckCircle2 className="mx-auto h-24 w-24 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 mb-8">
          Your appointment has been successfully booked and confirmed. You will
          receive an email with your booking details shortly.
        </p>
        <Link
          href="/dashboard/appointments"
          className="inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
        >
          View My Appointments
        </Link>
      </div>
    </div>
  );
}
