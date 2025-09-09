import Link from 'next/link';
import { Calendar, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-bold">The Platform</span>
            </div>
            <p className="text-gray-400 mb-4">
              The complete salon booking and management platform trusted by 500+ salons across South Africa.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@appointmentbooking.co.za</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+27 11 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Cape Town, South Africa</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
              <li><Link href="/webinars" className="hover:text-white transition-colors">Webinars</Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/partners" className="hover:text-white transition-colors">Partners</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 The Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}