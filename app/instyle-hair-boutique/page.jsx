"use client";

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function InstyleBooking() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch services for Instyle salon
      const { data: servicesData } = await supabase
        .from('services')
        .select('id, name, description, price_cents, duration_minutes, category_id, service_categories(name)')
        .eq('salon_id', process.env.NEXT_PUBLIC_INSTYLE_SALON_ID) // Use NEXT_PUBLIC for client-side env vars
        .order('sort_order', { referencedTable: 'service_categories', ascending: true });
      setServices(servicesData || []);

      // 2. Fetch e-commerce products
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, price_cents, image_url')
        .eq('salon_id', process.env.NEXT_PUBLIC_INSTYLE_SALON_ID)
        .limit(6);
      setProducts(productsData || []);
    }

    fetchData();
  }, []);

  // Group services by category
  const grouped = services?.reduce((acc, s) => {
    const cat = s.service_categories?.name || 'Other';
    (acc[cat] = acc[cat] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      {/* Sticky Header with Logo */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Image
            src="/instyle-logo.svg"   // <— place logo in /public
            alt="Instyle Hair Boutique"
            width={180}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <Link href="#book">
            <button className="bg-[#C0392B] text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">
              Book Now
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative text-center py-20 bg-gradient-to-r from-[#C0392B] to-[#A93226] text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Where Style is Perfected
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg opacity-90">
          Premium hair treatments, professional styling, and colour services.
        </p>
      </section>

      {/* Services */}
      <section id="services" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-10">
              <h3 className="text-2xl font-semibold mb-4 text-[#1B1B1B]">
                {category}
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Exclusive Hair Care</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section id="book" className="py-16 bg-[#C0392B] text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Look?</h2>
        <button className="mt-4 bg-white text-[#C0392B] font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
          Choose Your Slot
        </button>
      </section>
    </div>
  );
}

/* ---------- Re-usable card components ---------- */
function ServiceCard({ service }) {
  const price = (service.price_cents / 100).toLocaleString('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  });
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      <h4 className="text-xl font-bold mb-2">{service.name}</h4>
      <p className="text-gray-600 text-sm mb-3 flex-1">{service.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-[#C0392B]">{price}</span>
        <span className="text-sm text-gray-500">{service.duration_minutes} min</span>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const price = (product.price_cents / 100).toLocaleString('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  });
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <Image
        src={product.image_url || '/placeholder.jpg'}
        alt={product.name}
        width={600}
        height={400}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h4 className="font-bold text-lg mb-1">{product.name}</h4>
        <p className="text-[#C0392B] font-semibold">{price}</p>
      </div>
    </div>
  );
}