'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Suspense } from 'react';
import VirtualReceptionist from '../components/AI/VirtualReceptionist';
import AutomatedReviews from '../components/Reviews/AutomatedReviews';
import Link from 'next/link';

export default function InStyleSalonPage({ params }) {
  const [salonData, setSalonData] = useState(null);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [socialData, setSocialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const salonIdentifier = params.salon;

  useEffect(() => {
    if (salonIdentifier === 'instylehairboutique') {
      // Load InStyle specific data
      const instyleData = {
        name: 'InStyle Hair Boutique',
        description: 'Premium hair boutique specializing in treatments, styling, and color services. We don\'t do cuts - we perfect your existing style.',
        phone: '+27 11 234 5678',
        email: 'info@instylehairboutique.co.za',
        address: 'Johannesburg, South Africa',
        hours: {
          'Monday - Friday': '9:00 AM - 5:00 PM',
          'Saturday': '8:00 AM - 4:00 PM',
          'Sunday': 'Closed'
        },
        specialties: [
          'Hair Treatments',
          'Professional Styling',
          'Color Services',
          'Bridal Hair',
          'Extensions',
          'Hair Care Products'
        ]
      };

      setSalonData(instyleData);
      loadServices();
      loadProducts();
      loadSocialMedia();
    }
  }, [salonIdentifier]);

  const loadServices = async () => {
    try {
      const response = await fetch(`/api/public/services?salon=${salonIdentifier}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`/api/public/products?salon=${salonIdentifier}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadSocialMedia = async () => {
    try {
      const response = await fetch('/api/scrape-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platforms: ['instagram', 'tiktok'] })
      });

      if (response.ok) {
        const data = await response.json();
        setSocialData(data);
      }
    } catch (error) {
      console.error('Error loading social media data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading InStyle Hair Boutique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {salonData?.name}
              </h1>
              <p className="text-gray-600 mt-1">Premium Hair Boutique</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/instyle_hair_boutique_/" target="_blank" rel="noopener noreferrer" 
                 className="text-pink-600 hover:text-pink-800 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@instylehairboutique" target="_blank" rel="noopener noreferrer"
                 className="text-purple-600 hover:text-purple-800 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">We Don't Do Cuts - We Perfect Your Style</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Premium hair treatments, professional styling, and color services. 
            Transform your existing style with our expert care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="supersaas-booking-widget">
              <button 
                onClick={() => window.supersaas_695384?.show()} 
                className="bg-white text-pink-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Book Your Appointment
              </button>
            </div>
            <Link href={`/${salonIdentifier}/shop`} 
                  className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-white hover:text-pink-600 transition-colors">
              Shop Products
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">Our Signature Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.5 2.5L16 5.5 13.5 3M7 7h2a2 2 0 012 2v1a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-900">{service.name}</h4>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-pink-600">R{(service.price / 100).toFixed(2)}</span>
                    <span className="text-sm text-gray-500">{service.duration_minutes} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Gallery */}
      {socialData && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">Follow Our Work</h3>

            {/* Instagram Gallery */}
            {socialData.instagram?.posts && (
              <div className="mb-12">
                <h4 className="text-2xl font-semibold mb-6 text-center text-pink-600">Instagram Highlights</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {socialData.instagram.posts.map((post, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <Image 
                        src={post.image} 
                        alt={post.description}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TikTok Videos */}
            {socialData.tiktok?.videos && (
              <div>
                <h4 className="text-2xl font-semibold mb-6 text-center text-purple-600">TikTok Showcases</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {socialData.tiktok.videos.map((video, index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative">
                        <Image 
                          src={video.thumbnail} 
                          alt={video.description}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Automated Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AutomatedReviews salonId="instylehairboutique" />
        </div>
      </section>

      {/* AI Virtual Receptionist */}
      <VirtualReceptionist salonData={{ name: 'InStyle Hair Boutique', subdomain: 'instylehairboutique' }} />

      {/* SuperSaaS Integration */}
      <script src="https://cdn.supersaas.net/widget.js"></script>
      <script dangerouslySetInnerHTML={{
        __html: `var supersaas_695384 = new SuperSaaS("517890:InStyle_Hair_Boutique","695384:Instyle_Hair_Boutique",{})`
      }} />
    </div>
  );
}