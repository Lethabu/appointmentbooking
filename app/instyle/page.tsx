import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InStyle Hair Boutique - Premium Hair Salon in Johannesburg',
  description: 'Experience luxury hair services at InStyle Hair Boutique. Specializing in balayage, highlights, cuts, and styling in the heart of Johannesburg.',
};

export default function InstylePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-6">
            InStyle Hair Boutique
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Where luxury meets artistry. Experience premium hair services in the heart of Johannesburg.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Your Appointment</h2>
            <p className="text-gray-600 mb-6">
              Ready to transform your hair? Contact us to schedule your appointment.
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <span className="font-semibold text-gray-700">📞 Phone:</span>
                <span className="ml-2 text-gray-600">+27 11 123 4567</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700">✉️ Email:</span>
                <span className="ml-2 text-gray-600">hello@instylehairboutique.co.za</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700">📍 Address:</span>
                <span className="ml-2 text-gray-600">123 Sandton Drive, Johannesburg</span>
              </div>
            </div>
            <button 
              className="w-full mt-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
              onClick={() => window.location.href = 'tel:+27111234567'}
            >
              Call Now to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
