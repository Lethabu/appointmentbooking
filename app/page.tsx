import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <div className="mb-4 inline-block bg-white/20 text-white border border-white/30 rounded-full px-3 py-1 text-sm">
              🚀 Trusted by 500+ salons across South Africa
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              The Complete Salon
              <span className="block text-yellow-300">Booking Platform</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Increase bookings by 300%, reduce no-shows by 80%, and delight customers with AI-powered appointment management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/book-demo"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium bg-white text-purple-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium border border-white text-white rounded-md hover:bg-white/10 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Active Salons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Monthly Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4.9★</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to grow</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From booking to billing, we&apos;ve got every aspect of your salon covered.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg bg-white p-6">
              <div className="mb-4">
                <div className="h-12 w-12 text-purple-600 mb-4">📅</div>
                <h3 className="text-xl font-semibold mb-2">Smart Booking</h3>
                <p className="text-gray-600 mb-4">
                  AI-powered scheduling that prevents double bookings and optimizes your calendar
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Real-time availability</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Automated reminders</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Multi-staff scheduling</span>
                </li>
              </ul>
            </div>

            <div className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg bg-white p-6">
              <div className="mb-4">
                <div className="h-12 w-12 text-blue-600 mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2">Customer Experience</h3>
                <p className="text-gray-600 mb-4">
                  Delight customers with seamless booking and loyalty rewards
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">One-click rebooking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Loyalty points system</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">AI chat support</span>
                </li>
              </ul>
            </div>

            <div className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg bg-white p-6">
              <div className="mb-4">
                <div className="h-12 w-12 text-teal-600 mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-2">Business Growth</h3>
                <p className="text-gray-600 mb-4">
                  Analytics and tools to grow your revenue and customer base
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Revenue analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Marketing automation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Referral program</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to transform your salon?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful salons using our platform. Start your free trial today.
          </p>
          <Link 
            href="/book-demo"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium bg-white text-purple-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </main>
  );
}