import { BookingWidget } from '@/app/components/BookingWidget/BookingWidget';

export default function BookInstylePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                InStyle Hair Boutique
              </h1>
              <p className="text-gray-600">
                Schedule your appointment with our professional stylists
              </p>
            </div>
            <BookingWidget tenantId="instyle" />
          </div>
        </div>
      </div>
    </div>
  );
}
