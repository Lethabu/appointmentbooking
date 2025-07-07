export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          Welcome to InStyle Hair Boutique
        </h1>
        <p className="text-lg text-gray-600">
          Your premium destination for hair care and styling. Book your appointment with us seamlessly.
        </p>
      </header>
      
      <main>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Book Your Appointment</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-full"
                src="https://www.supersaas.com/schedule/demo/Standard_Service"
                title="Booking Widget"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}