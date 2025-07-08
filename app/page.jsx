export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Welcome to InStyle Hair Boutique
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your premium destination for hair care and styling. Book your appointment with us seamlessly.
      </p>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Book Your Appointment</h2>
          <div style={{ position: 'relative', paddingBottom: '100%', height: 0, overflow: 'hidden' }}>
            <iframe
              src="https://www.supersaas.com/schedule/demo/Standard_Service" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              title="Booking Widget"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}