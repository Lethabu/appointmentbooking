import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';

export function InstyleFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-rose-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND COLUMN */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent mb-4">
              InStyle Hair Boutique
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Where luxury meets artistry. Experience premium hair services with
              our team of expert stylists in the heart of Johannesburg.
            </p>

            {/* SOCIAL MEDIA */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-rose-400 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-rose-400 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-rose-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-rose-300">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>123 Sandton Drive</p>
                  <p>Sandton, Johannesburg</p>
                  <p>2196, South Africa</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>+27 11 123 4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>hello@instylehairboutique.co.za</p>
                </div>
              </div>
            </div>
          </div>

          {/* HOURS */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-rose-300">
              Opening Hours
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div className="text-gray-300">
                  <p className="font-medium">Monday - Friday</p>
                  <p>9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="text-gray-300 ml-8">
                <p className="font-medium">Saturday</p>
                <p>9:00 AM - 4:00 PM</p>
              </div>

              <div className="text-gray-300 ml-8">
                <p className="font-medium">Sunday</p>
                <p>Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 InStyle Hair Boutique. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-rose-400 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-rose-400 text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
