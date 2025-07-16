'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import AutomatedReviews from './components/Reviews/AutomatedReviews';
import { instyle_data } from './instyle-hair-boutique/data.js';

export default function HomePage() {
  const { name, booking_link, services, socials } = instyle_data;
  const [products, setProducts] = useState([]);

  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/public/products?salon=instylehairboutique`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 py-20">
        <div className="absolute inset-0">
          {/* Placeholder for a background image */}
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {name}
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto">
            Where Style is Perfected. Premium hair treatments, professional styling, and color services.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href={booking_link} className="inline-block bg-pink-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-pink-700 transition-colors shadow-lg">
              Book an Appointment
            </Link>
            <Link href="/instyle-hair-boutique/shop" className="inline-block bg-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-purple-700 transition-colors shadow-lg">
              Shop Hair Products
            </Link>
          </div>
        </div>
      </section>
      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-pink-600 font-semibold tracking-wide uppercase">Our Vision</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              From Salon to E-commerce Powerhouse
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              InStyle Hair Boutique has always been about more than just hair. It's about confidence, beauty, and the artistry of our stylists. Now, we're expanding our vision, bringing our curated selection of premium hair products directly to you.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-pink-600 font-semibold tracking-wide uppercase">Our Services</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Signature Hair Services
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              From stunning installations to rejuvenating treatments, we offer a range of services to perfect your look.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-pink-500 font-semibold">{service.name}</div>
                  <p className="mt-2 text-gray-500">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">R{(service.price / 100).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{service.duration_minutes} min</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href={booking_link} className="inline-block bg-pink-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-pink-700 transition-colors shadow-lg">
              View All Services & Book
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">Our Products</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Exclusive Hair Care
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Discover our range of high-quality weaves, extensions, and proprietary hair care products.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={product.image_url || '/placeholder.png'}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-purple-500 font-semibold">{product.name}</div>
                  <p className="mt-2 text-gray-500">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">R{(product.price / 100).toFixed(2)}</p>
                    <button
                      onClick={() => handleAddItem(product)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/instyle-hair-boutique/shop" className="inline-block bg-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-purple-700 transition-colors shadow-lg">
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials and Social Proof Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-pink-600 font-semibold tracking-wide uppercase">What Our Clients Say</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Loved by our Community
            </p>
          </div>
          <div className="mt-12">
            <AutomatedReviews salonId="instylehairboutique" />
          </div>
          <div className="mt-20">
            <div className="text-center">
                <h3 className="text-2xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    Find us on Social Media
                </h3>
            </div>
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder for Instagram Post */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6">
                        <p className="text-gray-500">@instyle_hair_boutique_</p>
                    </div>
                </div>
                {/* Placeholder for Facebook Post */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6">
                        <p className="text-gray-500">Instyle Hair Boutique</p>
                    </div>
                </div>
                {/* Placeholder for TikTok Post */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6">
                        <p className="text-gray-500">@instyle.hair.studio</p>
                   </div>
               </div>
           </div>
         </div>
       </div>
     </section>

     {/* Footer */}
     <footer className="bg-gray-800 text-white">
       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
         <div className="xl:grid xl:grid-cols-3 xl:gap-8">
           <div className="space-y-8 xl:col-span-1">
             <h2 className="text-2xl font-bold">InStyle Hair Boutique</h2>
             <p className="text-gray-400">
               Your destination for premium hair services and products.
             </p>
             <div className="flex space-x-6">
               <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                 <span className="sr-only">Instagram</span>
                 <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                   <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427.465C9.53 2.013 9.884 2 12.315 2zm0 1.622c-2.403 0-2.741.01-3.72.058-.975.045-1.504.207-1.857.344-.467.182-.86.399-1.242.781a3.27 3.27 0 00-.781 1.242c-.137.353-.3.882-.344 1.857-.048.98-.058 1.318-.058 3.72s.01 2.74.058 3.72c.045.975.207 1.504.344 1.857.182.466.399.86.781 1.242a3.27 3.27 0 001.242.781c.353.137.882.3 1.857.344.98.048 1.318.058 3.72.058s2.74-.01 3.72-.058c.975-.045 1.504-.207 1.857-.344.467-.182.86-.399 1.242-.781a3.27 3.27 0 00.781-1.242c.137-.353.3-.882.344-1.857.048-.98.058-1.318-.058-3.72s-.01-2.74-.058-3.72c-.045-.975-.207-1.504-.344-1.857a3.27 3.27 0 00-.781-1.242 3.27 3.27 0 00-1.242-.781c-.353-.137-.882-.3-1.857-.344-.98-.048-1.318-.058-3.72-.058z" clipRule="evenodd" />
                   <path d="M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM8.25 12a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" />
                 </svg>
               </a>
               <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                 <span className="sr-only">Facebook</span>
                 <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                   <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                 </svg>
               </a>
               <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                 <span className="sr-only">TikTok</span>
                 <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                   <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.86-.95-6.69-2.81-1.83-1.86-2.8-4.3-2.8-6.91 0-2.61 1.02-5.18 2.8-6.94 1.81-1.79 4.35-2.81 6.92-2.79.03 1.43-.02 2.86-.01 4.29.01 1.4-.52 2.79-1.48 3.86-1.04 1.14-2.62 1.76-4.22 1.71-.05-1.52.31-3.01.94-4.35.63-1.34 1.56-2.46 2.75-3.33.01-.01 0-.01 0 0z" />
                 </svg>
               </a>
             </div>
           </div>
         </div>
         <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
           <p className="text-base text-gray-400">&copy; 2024 InStyle Hair Boutique. All rights reserved.</p>
           <div className="flex space-x-6 md:order-2">
              <Link href="/dashboard" className="text-base text-gray-400 hover:text-white">
                Tenant Login
              </Link>
            </div>
         </div>
       </div>
     </footer>
    </div>
  );
}