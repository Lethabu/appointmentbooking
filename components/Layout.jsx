import Link from 'next/link';

const Header = () => (
  <header className="bg-white shadow-md sticky top-0 z-50">
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
            AppointmentBookings
          </Link>
        </div>
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4">
            <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="ml-4 flex items-center md:ml-6 space-x-2">
            <Link href="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Log in
            </Link>
            <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  </header>
);

const Footer = () => (
  <footer className="bg-white border-t">
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} AppointmentBookings.co.za. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link>
          <span>&middot;</span>
          <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}