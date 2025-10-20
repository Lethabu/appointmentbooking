'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/app/utils/supabaseClient';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Calendar as CalendarIcon,
} from 'lucide-react';

export default function ModernCalendar({
  salonId,
  serviceId,
  onBookingConfirmed,
  onBack,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchStaff = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, specialty, image_url')
        .eq('salon_id', salonId)
        .eq('is_active', true);

      if (error) throw error;
      setStaff(data || []);
    } catch (err) {
      setError('Failed to load staff');
    }
  }, [salonId]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDate || !selectedStaff) return;
    setLoading(true);
    setError(null);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('availability')
        .select('start_time, end_time')
        .eq('staff_id', selectedStaff)
        .eq('date', dateStr)
        .order('start_time');

      if (error) throw error;

      const slots = [];
      data.forEach((slot) => {
        const start = new Date(`${dateStr}T${slot.start_time}`);
        const end = new Date(`${dateStr}T${slot.end_time}`);

        while (start < end) {
          slots.push(
            start.toLocaleTimeString('en-ZA', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
          );
          start.setMinutes(start.getMinutes() + 30);
        }
      });

      setAvailableSlots(slots);
    } catch (err) {
      setError('Failed to load available times');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedStaff]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedStaff) {
      setError('Please select a date, time, and stylist to proceed.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to book an appointment.');
        setLoading(false);
        return;
      }

      const bookingData = {
        user_id: user.id,
        salon_id: salonId,
        service_id: serviceId,
        staff_id: selectedStaff,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        status: 'confirmed',
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;

      onBookingConfirmed(data);
    } catch (err) {
      setError(
        err.message ||
          'An unexpected error occurred while creating the booking.',
      );
    } finally {
      setLoading(false);
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Services
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Select Your Appointment</h2>
          <p className="text-purple-100">
            Choose your preferred date, time, and stylist
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4 text-sm">
              <p>{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column: Calendar and Staff */}
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
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                          ),
                        )
                      }
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h4 className="font-semibold text-center">
                      {currentMonth.toLocaleDateString('en-ZA', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h4>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                          ),
                        )
                      }
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                      <div key={day} className="font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    {getDaysInMonth().map((date, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          date && !isPastDate(date) && setSelectedDate(date)
                        }
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

              {/* Staff Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Select Stylist
                </h3>
                <div className="space-y-3">
                  {staff.map((stylist) => (
                    <button
                      key={stylist.id}
                      onClick={() => setSelectedStaff(stylist.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedStaff === stylist.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                          {stylist.image_url ? (
                            <Image
                              src={stylist.image_url}
                              alt={stylist.name}
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {stylist.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {stylist.specialty || 'Stylist'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Time and Booking */}
            <div className="space-y-6">
              {/* Time Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Select Time
                </h3>
                {loading && <p className="text-gray-500">Loading times...</p>}
                {!loading && availableSlots.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg border text-center transition-colors ${selectedTime === time ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 hover:bg-purple-100'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
                {!loading &&
                  availableSlots.length === 0 &&
                  selectedDate &&
                  selectedStaff && (
                    <p className="text-gray-500 bg-gray-100 p-3 rounded-lg">
                      No available slots for this day.
                    </p>
                  )}
                {!selectedDate ||
                  (!selectedStaff && (
                    <p className="text-gray-400 text-sm">
                      Please select a date and stylist to see available times.
                    </p>
                  ))}
              </div>

              {/* Booking Button */}
              <div>
                <button
                  onClick={handleBooking}
                  disabled={
                    !selectedDate || !selectedTime || !selectedStaff || loading
                  }
                  className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}