import Link from 'next/link'

const CheckIcon = () => (
  <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            The All-In-One Platform for Modern Salons
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered bookings, integrated e-commerce, and intelligent growth tools.
            Stop juggling apps and start growing your business.
          </p>
          <Link href="/signup" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors text-lg">
            Start Your 14-Day Free Trial
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Everything Your Salon Needs to Thrive</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Smart Booking System</h3>
              <p className="text-gray-600">
                An intelligent, 24/7 booking engine that works for you. Reduce no-shows with automated reminders and let our AI assistant, Nia, handle client queries.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Integrated E-commerce</h3>
              <p className="text-gray-600">
                Sell products, weaves, and gift cards directly from your white-labeled website. Offer flexible payment options like Payflex to boost sales.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">AI-Powered Growth Tools</h3>
              <p className="text-gray-600">
                Leverage our suite of AI agents—Blaze for marketing, Orion for commerce, and Nova for business strategy—to make data-driven decisions and grow your brand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Essential Suite */}
            <div className="border rounded-lg p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Essential Suite</h3>
              <p className="text-4xl font-bold mb-4">R350<span className="text-lg font-normal">/mo</span></p>
              <p className="text-gray-600 mb-6">The perfect starting point for solo stylists and small salons.</p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center"><CheckIcon /> Unlimited Bookings</li>
                <li className="flex items-center"><CheckIcon /> AI Booking Agent (Nia)</li>
                <li className="flex items-center"><CheckIcon /> WhatsApp Reminders</li>
                <li className="flex items-center"><CheckIcon /> Subdomain URL</li>
              </ul>
              <Link href="/signup" className="w-full text-center bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro Commerce */}
            <div className="border-2 border-indigo-600 rounded-lg p-8 flex flex-col relative">
              <div className="absolute top-0 -translate-y-1/2 bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Pro Commerce</h3>
              <p className="text-4xl font-bold mb-4">R1,000<span className="text-lg font-normal">/mo</span></p>
              <p className="text-gray-600 mb-6">For growing salons that want to sell products and build their brand.</p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center"><CheckIcon /> Everything in Essential</li>
                <li className="flex items-center"><CheckIcon /> **White-Label Custom Domain**</li>
                <li className="flex items-center"><CheckIcon /> **Full E-commerce Store**</li>
                <li className="flex items-center"><CheckIcon /> **Payflex Integration**</li>
                <li className="flex items-center"><CheckIcon /> AI Commerce Agent (Orion)</li>
              </ul>
              <Link href="/signup" className="w-full text-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                Start Free Trial
              </Link>
            </div>

            {/* Elite Growth */}
            <div className="border rounded-lg p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Elite Growth</h3>
              <p className="text-4xl font-bold mb-4">R3,000<span className="text-lg font-normal">/mo</span></p>
              <p className="text-gray-600 mb-6">For established businesses and academies requiring advanced tools.</p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center"><CheckIcon /> Everything in Pro</li>
                <li className="flex items-center"><CheckIcon /> **AI Marketing Agent (Blaze)**</li>
                <li className="flex items-center"><CheckIcon /> **AI Strategy Agent (Nova)**</li>
                <li className="flex items-center"><CheckIcon /> Advanced Analytics</li>
                <li className="flex items-center"><CheckIcon /> API Access</li>
              </ul>
              <Link href="/signup" className="w-full text-center bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Salon?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join the growing number of salons choosing smart automation and e-commerce to drive growth.
          </p>
          <Link href="/signup" className="bg-white text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors text-lg">
            Start Your Free Trial Today
          </Link>
        </div>
      </section>
    </div>
  )
}