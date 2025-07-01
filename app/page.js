import Image from "next/image";
import Link from "next/link";

// Icon components
const CheckIcon = () => (
  <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);
const CrossIcon = () => (
  <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

// Hero Section
function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
          The All-in-One Platform to Manage and Grow Your Salon.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          From intelligent AI-powered bookings and seamless e-commerce to automated client reminders, AppointmentBookings.co.za is the last platform you'll ever need.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-indigo-600 text-white font-bold py-4 px-10 rounded-lg hover:bg-indigo-700 transition-colors text-lg shadow-lg"
        >
          Start Your 14-Day Free Trial
        </Link>
      </div>
    </section>
  );
}

// Social Proof Section
function SocialProofSection() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
            Trusted by leading salons in South Africa
          </p>
          <div className="mt-6 flex justify-center">
            {/* Placeholder for a real logo */}
            <div className="text-gray-400 font-medium text-lg italic">
              InStyle Hair Boutique
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Icon Wrapper
function FeatureIcon({ children }) {
  return (
    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
      {children}
    </div>
  );
}

// Features Section
function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">A Smarter Way to Run Your Salon</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Focus on your craft, we'll handle the rest.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FeatureIcon>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </FeatureIcon>
            <h3 className="text-xl font-bold mb-2">Your 24/7 AI Assistant</h3>
            <p className="text-gray-600">Our AI, Nia, handles bookings, answers client questions, and fills your calendar, even while you sleep.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FeatureIcon>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </FeatureIcon>
            <h3 className="text-xl font-bold mb-2">Sell Products, Effortlessly</h3>
            <p className="text-gray-600">Launch a beautiful online store for your hair care products and weaves. Integrated with Payflex for 'buy now, pay later'.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FeatureIcon>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M