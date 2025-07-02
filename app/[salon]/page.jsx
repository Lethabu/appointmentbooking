
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SalonBookingPage() {
  const params = useParams();
  const [salonData, setSalonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch salon data based on the slug
    const fetchSalonData = async () => {
      try {
        // For now, use mock data for InStyle Hair Boutique
        if (params.salon === 'instylehairboutique') {
          setSalonData({
            name: 'InStyle Hair Boutique',
            description: 'Your style, our passion. Book your appointment with our expert stylists.',
            logo: '/logo.png',
            services: ['Haircut', 'Hair Styling', 'Coloring', 'Treatment'],
            address: 'Cape Town, South Africa',
            phone: '+27 21 123 4567'
          });
        }
      } catch (error) {
        console.error('Error fetching salon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonData();
  }, [params.salon]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!salonData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Salon Not Found</h1>
          <p className="text-gray-600 mt-2">The salon you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{salonData.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href={`tel:${salonData.phone}`} className="text-blue-600 hover:text-blue-800">
                {salonData.phone}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">{salonData.name}</h2>
          <p className="text-xl mb-8">{salonData.description}</p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
            Book Now
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {salonData.services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <h4 className="text-xl font-semibold mb-2">{service}</h4>
                <p className="text-gray-600">Professional {service.toLowerCase()} services</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-8">Book Your Appointment</h3>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Select your preferred date and time</p>
              {/* This is where you'll embed the SuperSaaS widget */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <p className="text-gray-500">SuperSaaS Booking Widget will be embedded here</p>
                <p className="text-sm text-gray-400 mt-2">
                  Salon: {params.salon}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 {salonData.name}. All rights reserved.</p>
          <p className="text-gray-400 mt-2">{salonData.address}</p>
        </div>
      </footer>
    </div>
  );
}
