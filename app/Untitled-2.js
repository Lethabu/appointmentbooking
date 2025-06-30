import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Solutions</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/#features" className="text-base text-gray-600 hover:text-gray-900">AI Booking</Link></li>
              <li><Link href="/#features" className="text-base text-gray-600 hover:text-gray-900">E-commerce</Link></li>
              <li><Link href="/#pricing" className="text-base text-gray-600 hover:text-gray-900">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/about" className="text-base text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link href="/contact" className="text-base text-gray-600 hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/privacy" className="text-base text-gray-600 hover:text-gray-900">Privacy</Link></li>
              <li><Link href="/terms" className="text-base text-gray-600 hover:text-gray-900">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-500 text-center">&copy; {new Date().getFullYear()} AppointmentBookings.co.za. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}