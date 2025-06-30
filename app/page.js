import Image from "next/image";
import Link from 'next/link'

const CheckIcon = () => <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>;
const CrossIcon = () => <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

const HeroSection = () => (
  <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
    <div className="container mx-auto px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
        The All-in-One Platform to Manage and Grow Your Salon.
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        From intelligent AI-powered bookings and seamless e-commerce to automated client reminders, AppointmentBookings.co.za is the last platform you'll ever need.
      </p>
      <Link href="/signup" className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-lg hover:bg-indigo-700 transition-colors text-lg shadow-lg">
        Start Your 14-Day Free Trial
      </Link>
    </div>
  </section>
);

const SocialProofSection = () => (
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

const FeatureIcon = ({ children }) => (
    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
        {children}
    </div>
);

const FeaturesSection = () => (
    <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">A Smarter Way to Run Your Salon</h2>
                <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Focus on your craft, we'll handle the rest.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <FeatureIcon>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </FeatureIcon>
                    <h3 className="text-xl font-bold mb-2">Your 24/7 AI Assistant</h3>
                    <p className="text-gray-600">Our AI, Nia, handles bookings, answers client questions, and fills your calendar, even while you sleep.</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <FeatureIcon>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </FeatureIcon>
                    <h3 className="text-xl font-bold mb-2">Sell Products, Effortlessly</h3>
                    <p className="text-gray-600">Launch a beautiful online store for your hair care products and weaves. Integrated with Payflex for 'buy now, pay later'.</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <FeatureIcon>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    </FeatureIcon>
                    <h3 className="text-xl font-bold mb-2">Eliminate No-Shows</h3>
                    <p className="text-gray-600">Automated WhatsApp reminders reduce no-shows and keep your clients informed, building loyalty and professionalism.</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <FeatureIcon>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </FeatureIcon>
                    <h3 className="text-xl font-bold mb-2">Your Brand, Your Platform</h3>
                    <p className="text-gray-600">Run the entire platform on your own custom domain, with your logo and branding, for a seamless client experience.</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingSection = () => (
    <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Simple, Transparent Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Essential Suite */}
                <div className="border rounded-lg p-8 flex flex-col bg-white shadow-lg">
                    <h3 className="text-2xl font-bold mb-2">Essential Suite</h3>
                    <p className="text-gray-500 mb-4">For solo stylists and small salons.</p>
                    <p className="text-4xl font-bold mb-4">R350<span className="text-lg font-normal text-gray-500">/mo</span></p>
                    <ul className="space-y-4 mb-8 flex-grow text-gray-700">
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2">Unlimited Bookings & Clients</span></li>
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2">AI Booking Agent (Nia)</span></li>
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2">WhatsApp Reminders</span></li>
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2">Subdomain URL</span></li>
                        <li className="flex items-start"><CrossIcon /> <span className="ml-2 text-gray-400">Custom `www` Domain</span></li>
                        <li className="flex items-start"><CrossIcon /> <span className="ml-2 text-gray-400">E-commerce Store</span></li>
                    </ul>
                    <Link href="/signup" className="w-full text-center bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                        Start Free Trial
                    </Link>
                </div>

                {/* Pro Commerce */}
                <div className="border-2 border-indigo-600 rounded-lg p-8 flex flex-col relative bg-white shadow-2xl transform scale-105">
                    <div className="absolute top-0 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                    <h3 className="text-2xl font-bold mb-2">Pro Commerce</h3>
                    <p className="text-gray-500 mb-4">For growing salons ready to sell online.</p>
                    <p className="text-4xl font-bold mb-4">R1000<span className="text-lg font-normal text-gray-500">/mo</span></p>
                    <ul className="space-y-4 mb-8 flex-grow text-gray-700">
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2">Everything in Essential</span></li>
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2 font-semibold">White-Label Custom Domain</span></li>
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2 font-semibold">Full E-commerce Store</span></li>
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2 font-semibold">Payflex Integration</span></li>
                        <li className="flex items-start"><CrossIcon /> <span className="ml-2 text-gray-400">Advanced AI Agents</span></li>
                    </ul>
                    <Link href="/signup" className="w-full text-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                        Start Free Trial
                    </Link>
                </div>

                {/* Elite Growth */}
                <div className="border rounded-lg p-8 flex flex-col bg-white shadow-lg">
                    <h3 className="text-2xl font-bold mb-2">Elite Growth</h3>
                    <p className="text-gray-500 mb-4">For established brands and academies.</p>
                    <p className="text-4xl font-bold mb-4">R3000<span className="text-lg font-normal text-gray-500">/mo</span></p>
                    <ul className="space-y-4 mb-8 flex-grow text-gray-700">
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2">Everything in Pro Commerce</span></li>
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2 font-semibold">Advanced AI Agents (Blaze, Nova)</span></li>
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2 font-semibold">API Access</span></li>
                        <li className="flex items-start"><CheckIcon /> <span className="ml-2 font-semibold">Dedicated Support</span></li>
                    </ul>
                    <Link href="/signup" className="w-full text-center bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                        Start Free Trial
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

const FinalCTASection = () => (
    <section className="py-20 bg-indigo-700">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Salon Business?
            </h2>
            <p className="text-lg text-indigo-200 mb-8 max-w-2xl mx-auto">
                Join dozens of modern salons who are automating their operations and boosting their revenue with AppointmentBookings.co.za.
            </p>
            <Link href="/signup" className="bg-white text-indigo-700 font-bold py-4 px-10 rounded-lg hover:bg-gray-100 transition-colors text-lg shadow-xl">
                Get Started for Free
            </Link>
        </div>
    </section>
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <PricingSection />
      <FinalCTASection />
    </>
  );
}
