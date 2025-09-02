'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Calendar, Users, TrendingUp } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">AppointmentBooking</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <Link href="/features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-purple-600 transition-colors">
              Blog
            </Link>
            <Link href="/compare" className="text-gray-600 hover:text-purple-600 transition-colors">
              Compare
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-purple-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/book-demo">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/pricing" className="text-gray-600 hover:text-purple-600">
                Pricing
              </Link>
              <Link href="/features" className="text-gray-600 hover:text-purple-600">
                Features
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-purple-600">
                Blog
              </Link>
              <Link href="/compare" className="text-gray-600 hover:text-purple-600">
                Compare
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-purple-600">
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link href="/login">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/book-demo">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}