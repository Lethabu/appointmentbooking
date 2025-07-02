import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AppointmentBookings
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional salon management platform with AI-powered booking and customer engagement
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard" className="btn text-lg px-8 py-3">
              Dashboard
            </Link>
            <Link href="/instylehairboutique" className="btn-secondary text-lg px-8 py-3">
              View Demo Salon
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card text-center">
              <h3 className="text-xl font-semibold mb-4">Smart Booking</h3>
              <p className="text-gray-600">AI-powered appointment scheduling with SuperSaaS integration</p>
            </div>
            <div className="card text-center">
              <h3 className="text-xl font-semibold mb-4">Multi-Domain</h3>
              <p className="text-gray-600">White-label solution for multiple salon brands</p>
            </div>
            <div className="card text-center">
              <h3 className="text-xl font-semibold mb-4">Real-time Analytics</h3>
              <p className="text-gray-600">Track performance and customer engagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}