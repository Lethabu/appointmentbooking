'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '../../config/navigation';
// import { useUser } from '@/hooks/useUser'; // Placeholder for user state

export default function Navbar({ salonName }) {
  const pathname = usePathname();
  // const { user } = useUser(); // Placeholder for user state
  const user = null; // For demonstration purposes
  const links = salonName ? [] : user ? navLinks.authenticated : navLinks.public;

  // A more robust way to hide the navbar on specific pages
  const hiddenPaths = ['/instylehairboutique'];
  if (hiddenPaths.some(path => pathname.startsWith(path)) || pathname.match(/^\/[^\/]+$/) && pathname !== '/') {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {salonName || 'AppointmentBookings'}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-gray-900">
                {link.name}
              </Link>
            ))}
            {salonName && (
              <>
                <Link href="/book" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Book
                </Link>
                <Link href="/services" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Services
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}