'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { supabase } from '@/app/utils/supabaseClient';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';

export default function SimpleCalendar({ salonId, serviceId, onBookingConfirmed, onBack }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [stylistId, setStylistId] = useState(null);
  const [stylistName, setStylistName] = useState('Zanele Langa');
  const [servicePrice, setServicePrice] = useState(0); // State for service price
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize useRouter
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchStylist();
  }, [salonId]);

  // Fetch service price when serviceId changes
  useEffect(() => {
    if (serviceId) {
      fetchServicePrice();
    }
  }, [serviceId]);

  useEffect(() => {
    if (selectedDate && stylistId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, stylistId]);

  const fetchStylist = async () => {
    try {
      // For InStyle, we'll use a hardcoded stylist ID approach
      // This bypasses the staff table issues
      console.log('Fetching stylist for salon:', salonId);
      
      // Try to fetch staff, but don't fail if it doesn't work
      const { data, error } = await supabase
        .from('staff')
        .select('id, name')
        .eq('salon_id', salonId)
        .eq('is_active', true)
        .limit(1);

      if (data && data.length > 0) {
        setStylistId(data[0].id);
        setStylistName(data[0].name);
      } else {
        // Use a fallback approach - we'll use salon owner as default
        console.log('No staff found, using fallback');
        setStylistId('fallback-stylist-' + salonId);
        setStylistName('Zanele Langa');
      }
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error('Error fetching stylist:', err);
      // Don't set error for stylist fetch - we'll use fallback
      setStylistId('fallback-stylist-' + salonId);
      setStylistName('Zanele Langa');
    }
  };

  const fetchAvailableSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // For demo purposes, we'll create some default available slots
      // In a real app, you'd fetch from availability table
      const defaultSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00'
      ];
      
      // Filter out past times for today
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      let slots = defaultSlots;
      if (dateStr === today) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        slots = defaultSlots.filter(time => {
          const [hour, minute] = time.split(':').map(Number);
          return hour > currentHour || (hour === currentHour && minute > currentMinute);
        });
      }
      
      setAvailableSlots(slots);
    } catch (err) {
      setError('Failed to load available times');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !stylistId) {
      setError('Please select a date and time to proceed.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to book an appointment.');
        setLoading(false);
        return;
      }

      // Initiate payment
      const response = await fetch('/api/paystack/initialize-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          serviceDetails: { id: serviceId, price: servicePrice }, // Use fetched service price
          salonId
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Paystack for payment using Next.js router
        router.push(data.authorization_url);
      } else {
        setError(data.error || 'Payment initialization failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while creating the booking.');
    } finally {
      setLoading(false);
    }
  };

  const fetchServicePrice = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('price')
        .eq('id', serviceId)
        .single();

      if (error) {
        throw error;
      }
      setServicePrice(data.price);
    } catch (err) {
      console.error('Error fetching service price:', err);
      setError('Failed to fetch service price.');
      setServicePrice(0); // Reset price on error
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = Array(startingDayOfWeek).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Services
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Book Your Appointment</h2>
          <p className="text-purple-100">With {stylistName}</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4 text-sm">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Calendar Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                Select Date
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h4 className="font-semibold text-center">
                    {currentMonth.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="font-medium text-gray-500 py-2">{day}</div>
                  ))}
                  {getDaysInMonth().map((date, index) => (
                    <button
                      key={index}
                      onClick={() => date && !isPastDate(date) && setSelectedDate(date)}
                      disabled={!date || isPastDate(date)}
                      className={`
                        py-2 rounded-full transition-colors aspect-square
                        ${!date ? 'invisible' : ''}
                        ${isPastDate(date) ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-purple-100'}
                        ${selectedDate?.toDateString() === date?.toDateString() ? 'bg-purple-600 text-white' : ''}
                      `}
                    >
                      {date?.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Select Time
              </h3>
              {loading && <p className="text-gray-500">Loading times...</p>}
              {!loading && availableSlots.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((time, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-lg border text-center transition-colors ${selectedTime === time ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 hover:bg-purple-100'}`}
                >
                  {time}
                </button>
              ))}
                </div>
              )}
              {!loading && availableSlots.length === 0 && selectedDate && (
                <p className="text-gray-500 bg-gray-100 p-3 rounded-lg">No available slots for this day.</p>
              )}
              {!selectedDate && (
                <p className="text-gray-400 text-sm">Please select a date to see available times.</p>
              )}
            </div>

            {/* Booking Button */}
            <div>
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || loading}
                className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
