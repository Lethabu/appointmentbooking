import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t" aria-label="Footer">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Location
            </h3>
            <p className="mt-4 text-base text-gray-500">
              123 Style Avenue
              <br />
              Johannesburg, 2000
              <br />
              South Africa
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Hours
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Mon-Fri: 9am - 7pm
              <br />
              Saturday: 10am - 5pm
              <br />
              Sunday: Closed
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Contact
            </h3>
            <p className="mt-4 text-base text-gray-500">
              <a
                href="tel:+27111234567"
                className="hover:text-gray-900"
                aria-label="Call us at +27 11 123 4567"
              >
                Tel: +27 11 123 4567
              </a>
              <br />
              <a
                href="mailto:hello@instylehair.co.za"
                className="hover:text-gray-900"
                aria-label="Email us at hello@instylehair.co.za"
              >
                Email: hello@instylehair.co.za
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; 2025 Instyle Hair Boutique. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
