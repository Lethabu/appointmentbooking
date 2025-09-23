import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <main className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your salon. All plans include our AI
            assistants and core features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-gray-600 mb-4">Perfect for solo stylists</p>
              <div className="text-4xl font-bold mb-2">R299</div>
              <div className="text-gray-500">per month</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Up to 100 bookings/month</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Nia AI Booking Assistant</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Online booking widget</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>WhatsApp notifications</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Email support</span>
              </li>
            </ul>

            <Link
              href="/book-demo"
              className="block w-full text-center py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Professional Plan */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-purple-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-gray-600 mb-4">For growing salons</p>
              <div className="text-4xl font-bold mb-2">R599</div>
              <div className="text-gray-500">per month</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Up to 500 bookings/month</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>All 3 AI Assistants (Nia, Blaze, Nova)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Multi-staff scheduling</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Advanced analytics & reports</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Marketing automation</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Custom branding</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Priority support</span>
              </li>
            </ul>

            <Link
              href="/book-demo"
              className="block w-full text-center py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">For salon chains</p>
              <div className="text-4xl font-bold mb-2">R1,299</div>
              <div className="text-gray-500">per month</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unlimited bookings</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>All AI features + custom training</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Multiple locations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Advanced integrations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>White-label solution</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>24/7 phone support</span>
              </li>
            </ul>

            <Link
              href="/book-demo"
              className="block w-full text-center py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All plans come with a 14-day free trial. No credit card
                required to start.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely. You can upgrade or downgrade your plan at any time.
                Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, EFT, and South African payment
                methods including SnapScan and Zapper.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Is my data secure?</h3>
              <p className="text-gray-600">
                Yes. We use enterprise-grade security with SSL encryption and
                comply with POPIA regulations.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8">
            Book a demo to see which plan is right for your salon
          </p>
          <Link
            href="/book-demo"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            Book Free Demo
          </Link>
        </div>
      </div>
    </main>
  );
}
