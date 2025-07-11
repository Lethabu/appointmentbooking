import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Instyle Hair Boutique
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/book" className="text-gray-700 hover:text-gray-900 transition-colors">
              Book
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-gray-900 transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
