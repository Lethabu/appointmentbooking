` tags.

```xml
<replit_final_file>
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to
            <span className="text-blue-600"> AppointmentBookings</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The modern booking platform for salons and beauty professionals. 
            Streamline your appointments, manage your business, and delight your clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/instylehairboutique" className="btn text-lg px-8 py-3">
              View InStyle Hair Boutique
            </a>
            <a href="/dashboard" className="btn-secondary text-lg px-8 py-3">
              Business Dashboard
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <div className="text-blue-600 text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p className="text-gray-600">Simple, intuitive booking system for your clients</p>
          </div>
          <div className="card text-center">
            <div className="text-blue-600 text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">Business Management</h3>
            <p className="text-gray-600">Complete dashboard to manage your salon operations</p>
          </div>
          <div className="card text-center">
            <div className="text-blue-600 text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">White Label</h3>
            <p className="text-gray-600">Fully customizable to match your brand</p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            See It In Action
          </h2>
          <p className="text-gray-600 mb-6">
            Experience our platform with InStyle Hair Boutique, our featured salon partner
          </p>
          <a 
            href="/instylehairboutique" 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200"
          >
            Book an Appointment →
          </a>
        </div>
      </div>
    </div>
  );
}