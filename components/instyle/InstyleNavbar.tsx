'use client';

import { useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';

export function InstyleNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO - INSTYLE ONLY */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              InStyle Hair Boutique
            </h1>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#home"
                className="text-gray-700 hover:text-rose-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </a>
              <a
                href="#services"
                className="text-gray-700 hover:text-rose-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Services
              </a>
              <a
                href="#gallery"
                className="text-gray-700 hover:text-rose-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Gallery
              </a>
              <a
                href="#booking"
                className="text-gray-700 hover:text-rose-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Book Now
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-rose-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          {/* CTA BUTTON */}
          <div className="hidden md:block">
            <button
              onClick={() => (window.location.href = 'tel:+27111234567')}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-rose-100">
              <a
                href="#home"
                className="text-gray-700 hover:text-rose-600 block px-3 py-2 text-base font-medium"
              >
                Home
              </a>
              <a
                href="#services"
                className="text-gray-700 hover:text-rose-600 block px-3 py-2 text-base font-medium"
              >
                Services
              </a>
              <a
                href="#gallery"
                className="text-gray-700 hover:text-rose-600 block px-3 py-2 text-base font-medium"
              >
                Gallery
              </a>
              <a
                href="#booking"
                className="text-gray-700 hover:text-rose-600 block px-3 py-2 text-base font-medium"
              >
                Book Now
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-rose-600 block px-3 py-2 text-base font-medium"
              >
                Contact
              </a>
              <button
                onClick={() => (window.location.href = 'tel:+27111234567')}
                className="w-full text-left bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-2 text-base font-medium rounded-lg mt-2"
              >
                📞 Call Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
