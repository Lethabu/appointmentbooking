"use client";

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, UserIcon, CalendarDaysIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'; // Added icons
import axios from 'axios'; // Import axios for API calls

export default function InstyleBooking() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]); // State for appointment history
  const [futureAppointments, setFutureAppointments] = useState([]); // State for future appointments
  const [loadingAppointments, setLoadingAppointments] = useState(true); // Loading state for appointments
  const [appointmentError, setAppointmentError] = useState(null); // Error state for appointments

  // State for booking form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null); // 'success', 'error', 'loading'
  const [bookingMessage, setBookingMessage] = useState('');

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
            scheduled_time,
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
          // Use scheduled_time for comparison
          const scheduledTime = new Date(booking.scheduled_time);
          if (scheduledTime < now) {
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
      <section id="book" className="py-16 bg-[#C0392B] text-white">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Ready to Transform Your Look?</h2>
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white mb-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                className="w-full p-3 rounded-lg text-gray-900 focus:ring-[#C0392B] focus:border-[#C0392B]"
                placeholder="Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 rounded-lg text-gray-900 focus:ring-[#C0392B] focus:border-[#C0392B]"
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                className="w-full p-3 rounded-lg text-gray-900 focus:ring-[#C0392B] focus:border-[#C0392B]"
                placeholder="+27 12 345 6789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-white mb-1">Select Service</label>
              <select
                id="service"
                className="w-full p-3 rounded-lg text-gray-900 focus:ring-[#C0392B] focus:border-[#C0392B]"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                required
              >
                <option value="">-- Choose a Service --</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name} - R{(service.price_cents / 100).toFixed(2)}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-white mb-1">Date</label>
                <input
                  type="date"
                  id="scheduledDate"
                  className="w-full p-3 rounded-lg text-gray-900 focus:ring-[#C0392B] focus:border-[#C0392B]"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-white mb-1">Time</label>
                <input
                  type="time"
                  id="scheduledTime"
                  className="w-full p-3 rounded-lg text-gray-900 focus:ring-[#C0392B] focus:border-[#C0392B]"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-white text-[#C0392B] font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={bookingStatus === 'loading'}
            >
              {bookingStatus === 'loading' ? 'Requesting Booking...' : 'Request My Booking'}
            </button>
            {bookingStatus === 'success' && (
              <div className="mt-4 flex items-center text-green-200">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span>{bookingMessage}</span>
              </div>
            )}
            {bookingStatus === 'error' && (
              <div className="mt-4 flex items-center text-red-200">
                <XCircleIcon className="w-5 h-5 mr-2" />
                <span>{bookingMessage}</span>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );

  async function handleBookingSubmit(e) {
    e.preventDefault();
    setBookingStatus('loading');
    setBookingMessage('');

    // Find the selected service name based on selectedServiceId
    const selectedService = services.find(s => s.id === selectedServiceId);
    if (!selectedService) {
      setBookingStatus('error');
      setBookingMessage('Invalid service selected.');
      return;
    }

    try {
      const response = await axios.post('/api/book', {
        full_name: fullName,
        email: email,
        phone: phone,
        service_name: selectedService.name, // Pass service name to API
        scheduled_time: `${scheduledDate}T${scheduledTime}:00.000Z`, // ISO 8601 format
        salon_id: process.env.NEXT_PUBLIC_INSTYLE_SALON_ID,
      });

      if (response.status === 201) {
        setBookingStatus('success');
        setBookingMessage('Booking requested successfully! We will confirm shortly.');
        // Clear form
        setFullName('');
        setEmail('');
        setPhone('');
        setSelectedServiceId('');
        setScheduledDate('');
        setScheduledTime('');
        // Re-fetch appointments to update the list
        // This part needs to be implemented if you want to see the new booking immediately
        // You might need to move the fetchAppointments logic into a separate function
        // and call it here. For now, it will update on next page load.
      } else {
        setBookingStatus('error');
        setBookingMessage(response.data.message || 'Failed to request booking.');
      }
    } catch (error) {
      console.error('Booking submission error:', error.response?.data || error.message);
      setBookingStatus('error');
      setBookingMessage(error.response?.data?.message || 'An unexpected error occurred during booking.');
    }
  }
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
  const scheduledTime = new Date(appointment.scheduled_time);
  const formattedDate = scheduledTime.toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedTime = scheduledTime.toLocaleTimeString('en-ZA', {
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