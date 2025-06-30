import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} AppointmentBookings.co.za. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-600 hover:text-indigo-600 text-sm">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-indigo-600 text-sm">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}