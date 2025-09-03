'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/utils/supabaseClient';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { nanoid } from 'nanoid';

export default function SimpleCalendar({ salonId, serviceId, onBookingConfirmed, onBack }) {
  console.log('Salon ID prop:', salonId); // Log salonId to check availability

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [stylistId, setStylistId] = useState(null);
  const [stylistName, setStylistName] = useState('Please select a stylist'); // Updated default
  const [servicePrice, setServicePrice] = useState(null); // State for service price, initialized to null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize useRouter
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchStylist();
  }, [salonId]);

  // Fetch service price when serviceId changes
  useEffect(() => {
    console.log('Service ID changed:', serviceId); // Log serviceId
    if (serviceId) {
      fetchServicePrice();
    } else {
      setServicePrice(null); // Reset price if serviceId is null/undefined
    }
  }, [serviceId]);

  useEffect(() => {
    // Only fetch slots if a date and a valid stylist are selected
    if (selectedDate && stylistId) {
      console.log('Fetching slots for date:', selectedDate, 'and stylist:', stylistId); // Log for debugging
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]); // Clear slots if conditions are not met
    }
  }, [selectedDate, stylistId]);

  const fetchStylist = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching stylist for salon with ID:', salonId);
      
      const { data, error } = await supabase
        .from('staff')
        .select('id, name')
        .eq('salon_id', salonId)
        .limit(1);

      console.log('Supabase staff query result - data:', data);
      console.log('Supabase staff query result - error:', error);

      if (error) {
        console.error('Supabase error fetching stylist:', error.message);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('Stylist found:', data[0]);
        setStylistId(data[0].id);
        setStylistName(data[0].name);
      } else {
        console.log('No staff found for salon with ID:', salonId);
        setStylistId(null);
        setStylistName('No stylist available'); // Changed message for clarity
      }
    } catch (err) {
      console.error('Error in fetchStylist:', err); // Log the caught error
      setError('Failed to load stylist information.');
      setStylistId(null); // Ensure stylistId is null on error
      setStylistName('Error loading stylist');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!stylistId) { // Only fetch slots if a stylist is selected
      setAvailableSlots([]); // Clear slots if no stylist is selected
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // For demo purposes, we'll create some default available slots
      // In a real app, you'd fetch from availability table
      const defaultSlots = generateHourlySlots(); // Use the new hourly slot generator
      
      // Filter out past times for today
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      let slots = defaultSlots;
      if (dateStr === today) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        slots = defaultSlots.filter(time => {
          const [hour, minute] = time.split(':').map(Number);
          // Keep slots that are in the future (hour > currentHour)
          // or if it's the current hour, keep slots where minute > currentMinute
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
    console.log("handleBooking called."); // Debug log
    if (!selectedDate || !selectedTime || !stylistId) {
      setError('Please select a date and time to proceed.');
      console.log("Booking validation failed: missing date, time, or stylist."); // Debug log
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("Attempting to get user session."); // Debug log
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const order_id = `booking_${nanoid(10)}`;

      // Initiate payment
      const response = await fetch('/api/payments/paystack/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: order_id,
          amount: servicePrice,
          email: session.user.email,
          currency: 'ZAR',
        }),
      });

      const data = await response.json();
      console.log("Payment initialization response:", data); // Debug log

      if (response.ok && data.authorization_url) {
        console.log("Redirecting to Paystack:", data.authorization_url); // Debug log
        // Redirect to Paystack for payment
        window.location.href = data.authorization_url;
      } else {
        console.error("Payment initialization failed:", data.error); // Debug log
        setError(data.error || 'Payment initialization failed. Please try again.');
      }
    } catch (err) {
      console.error('Error in handleBooking:', err.message); // Debug log
      setError(err.message || 'An unexpected error occurred while initiating payment.');
    } finally {
      setLoading(false);
      console.log("handleBooking finished, loading set to false."); // Debug log
    }
  };

  const fetchServicePrice = async () => {
    // This function is no longer directly needed for payment initiation as price is handled in the API route
    // but kept here in case it's used elsewhere or for future reference.
    try {
      const { data, error } = await supabase
        .from('services')
        .select('price_cents') // Fetch price in cents
        .eq('id', serviceId)
        .single();

      if (error) {
        console.error('Error fetching service price:', error);
        setError('Failed to fetch service price.');
        setServicePrice(0);
        return;
      }
      setServicePrice(data.price_cents); // Store price in cents
    } catch (err) {
      console.error('Error fetching service price:', err);
      setError('Failed to fetch service price.');
      setServicePrice(0);
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

  // Function to generate hourly time slots
  const generateHourlySlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) { // From 9 AM to 5 PM
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
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
          {servicePrice !== null && ( // Display service price if available
            <p className="text-purple-100">Price: R {servicePrice.toFixed(2)}</p>
          )}
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
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={`${day}-${index}`} className="font-medium text-gray-500 py-2">{day}</div>
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
            {!loading && availableSlots.length > 0 && stylistId && ( // Only show slots if stylistId is available
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((time) => ( // Use time as key
                <button
                  key={time} // Use time as the key
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-lg border text-center transition-colors ${selectedTime === time ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 hover:bg-purple-100'}`}
                >
                  {time}
                </button>
              ))}
                </div>
              )}
              {!loading && (!availableSlots.length || !stylistId) && selectedDate && ( // Show message if no slots or no stylist
                <p className="text-gray-500 bg-gray-100 p-3 rounded-lg">{stylistId ? 'No available slots for this day.' : 'Please select a stylist to see available times.'}</p>
              )}
              {!selectedDate && (
                <p className="text-gray-400 text-sm">Please select a date to see available times.</p>
              )}
            </div>

            {/* Booking Button */}
            <div>
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || !stylistId || loading} // Ensure stylistId is also checked
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
