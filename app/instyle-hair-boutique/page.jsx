"use client";

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, UserIcon, CalendarDaysIcon } from 'lucide-react'; // Added icons

export default function InstyleBooking() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]); // State for appointment history
  const [futureAppointments, setFutureAppointments] = useState([]); // State for future appointments
  const [loadingAppointments, setLoadingAppointments] = useState(true); // Loading state for appointments
  const [appointmentError, setAppointmentError] = useState(null); // Error state for appointments

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

  // Fetch appointments
  useEffect(() => {
    async function fetchAppointments() {
      setLoadingAppointments(true);
      setAppointmentError(null);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_date,
            booking_time,
            status,
            services (name),
            staff (name),
            users (name)
          `)
          .eq('salon_id', process.env.NEXT_PUBLIC_INSTYLE_SALON_ID)
          .order('booking_date', { ascending: true })
          .order('booking_time', { ascending: true });

        if (error) {
          throw error;
        }

        const now = new Date();
        const history = [];
        const future = [];

        data.forEach(booking => {
          // Combine date and time for comparison
          const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`);
          if (bookingDateTime < now) {
            history.push(booking);
          } else {
            future.push(booking);
          }
        });

        setAppointmentHistory(history);
        setFutureAppointments(future);
      } catch (err) {
        setAppointmentError('Failed to load appointments.');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoadingAppointments(false);
      }
    }

    fetchAppointments();
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

      {/* Appointment History & Future Appointments */}
      <section id="appointments" className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Your Appointments</h2>

          {/* Future Appointments */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-[#1B1B1B]">Upcoming Appointments</h3>
            {loadingAppointments && <p>Loading upcoming appointments...</p>}
            {appointmentError && <p className="text-red-500">{appointmentError}</p>}
            {!loadingAppointments && !appointmentError && futureAppointments.length === 0 && (
              <p>You have no upcoming appointments.</p>
            )}
            {!loadingAppointments && !appointmentError && futureAppointments.length > 0 && (
              <div className="space-y-4">
                {futureAppointments.map(appt => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))}
              </div>
            )}
          </div>

          {/* Appointment History */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-[#1B1B1B]">Past Appointments</h3>
            {!loadingAppointments && !appointmentError && appointmentHistory.length === 0 && (
              <p>You have no past appointments.</p>
            )}
            {!loadingAppointments && !appointmentError && appointmentHistory.length > 0 && (
              <div className="space-y-4">
                {appointmentHistory.map(appt => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))}
              </div>
            )}
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

/* ---------- Appointment Card Component ---------- */
function AppointmentCard({ appointment }) {
  const bookingDateTime = new Date(`${appointment.booking_date}T${appointment.booking_time}`);
  const formattedDate = bookingDateTime.toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedTime = bookingDateTime.toLocaleTimeString('en-ZA', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });

  const price = (appointment.price / 100).toLocaleString('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  });

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="bg-purple-100 p-3 rounded-lg">
          <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h4 className="text-lg font-bold">{appointment.services?.name || 'N/A'}</h4>
          <p className="text-sm text-gray-500">
            With {appointment.staff?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-500">
            Booked by: {appointment.users?.name || appointment.users?.email || 'N/A'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">{formattedDate}</p>
        <p className="font-semibold">{formattedTime}</p>
        <p className="text-sm text-gray-500">{appointment.status}</p>
      </div>
    </div>
  );
}