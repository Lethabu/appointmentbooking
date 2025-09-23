'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { supabase } from '@/lib/supabase';
import { inStyleBrand, inStyleConfig } from './config';
import Image from 'next/image';
import GoogleMap from './map';
import ContactSection from './contact';
import BookingWidget from '@/components/BookingWidget';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export default function InStylePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set static services with correct pricing
    const instyleServices = [
      {
        id: '1',
        name: 'Middle & Side Installation',
        description:
          'Professional middle-part weave installation with seamless blending',
        price: 30000,
        duration: 60,
      },
      {
        id: '2',
        name: 'Maphondo & Lines Installation',
        description:
          'Geometric artistry with traditional African braiding techniques',
        price: 35000,
        duration: 60,
      },
      {
        id: '3',
        name: 'Gel Maphondo',
        description: 'Sleek gel-styled Maphondo with precision lines',
        price: 35000,
        duration: 120,
      },
      {
        id: '4',
        name: 'Frontal Ponytail',
        description: 'High-fashion ponytail with lace frontal application',
        price: 95000,
        duration: 120,
      },
      {
        id: '5',
        name: 'Makeup Soft Glam',
        description: 'Natural glam makeup for any occasion',
        price: 45000,
        duration: 120,
      },
    ];
    setServices(instyleServices);
    setLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>
          Instyle Hair Boutique | Premium Hair Styling in Soshanguve & Mabopane
          | Book Online
        </title>
        <meta
          name="description"
          content="Expert weave installations, Maphondo braids & makeup services. Book online at Soshanguve's premier hair boutique. Middle & Side R300, Frontal Ponytail R950."
        />
        <meta
          name="keywords"
          content="hair salon Soshanguve, Maphondo braids, weave installation, makeup Mabopane, frontal ponytail, gel maphondo"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HairSalon',
              name: 'Instyle Hair Boutique',
              description:
                'Premium weave installations, Maphondo braids, and makeup services in Soshanguve',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '4582 Block B',
                addressLocality: 'Mabopane',
                addressRegion: 'Gauteng',
                postalCode: '0190',
                addressCountry: 'ZA',
              },
              telephone: '+27-64-769-6159',
              url: 'https://www.instylehairboutique.co.za',
              openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-16:00'],
              priceRange: 'R300-R950',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '127',
              },
            }),
          }}
        />
      </Head>

      <div
        style={
          {
            '--primary': inStyleBrand.primary,
            '--secondary': inStyleBrand.secondary,
          } as any
        }
      >
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
            <Image
              src={inStyleConfig.logo}
              alt={inStyleConfig.name}
              width={180}
              height={48}
              className="h-12 w-auto"
            />
            <button
              className="text-white font-bold py-2 px-4 rounded-lg transition"
              style={{ backgroundColor: inStyleBrand.primary }}
            >
              Book Now
            </button>
          </nav>
        </header>

        <section
          className="text-center py-20 text-white"
          style={{
            background: `linear-gradient(to right, ${inStyleBrand.primary}, ${inStyleBrand.secondary})`,
          }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Where Style is Perfected
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg opacity-90">
            Premium hair treatments, professional styling, and colour services.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {Object.entries(inStyleConfig.socials).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              >
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Services
            </h2>
            {loading ? (
              <div className="text-center">Loading services...</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-xl font-bold mb-2 text-[#1B1B1B]">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {service.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-[#C0392B]">
                        R{(service.price / 100).toFixed(0)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {service.duration} min
                      </span>
                    </div>
                    <button
                      className="w-full bg-[#C0392B] text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
                      onClick={() =>
                        (window.location.href = '/instylehairboutique/book')
                      }
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Book Your Appointment
            </h2>
            <BookingWidget />
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Find Us</h2>
            <GoogleMap />
          </div>
        </section>

        <ContactSection />

        {/* Business Info Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">📍 Location</h3>
                <p>
                  4582 Block B<br />
                  Mabopane, Pretoria 0190
                  <br />
                  South Africa
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">🕐 Opening Hours</h3>
                <p>
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 9:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">📞 Contact</h3>
                <p>
                  Phone: +27 64 769 6159
                  <br />
                  WhatsApp: +27 64 769 6159
                  <br />
                  Email: zanele@instyle.co.za
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
