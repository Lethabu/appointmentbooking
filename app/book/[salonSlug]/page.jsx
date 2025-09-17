'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/utils/supabaseClient';
import { Step2_DateTime } from '@/components/booking/Step2_DateTime';
import { Step3_UserDetails } from '@/components/booking/Step3_UserDetails';
import { Step4_Confirmation } from '@/components/booking/Step4_Confirmation';

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const { salonSlug } = params;
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({});

  useEffect(() => {
    if (salonSlug) {
      const fetchSalon = async () => {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .eq('slug', salonSlug)
          .single();
        if (data) {
          setSalon(data);
          fetchServices(data.id);
        }
      };
      fetchSalon();
    }
  }, [salonSlug]);

  const fetchServices = async (salonId) => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('salon_id', salonId);
    if (data) {
      setServices(data);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleConfirmBooking = async () => {
    const toastId = toast.loading('Booking your appointment...');
    try {
      const clientDetails = {
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
      };
      const serviceIds = [selectedService.id]; // Assuming serviceIds is an array

      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientDetails, serviceIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book appointment');
      }

      const result = await response.json();
      toast.success('Appointment booked successfully!', { id: toastId });
      router.push('/booking-success'); // Redirect to a success page
    } catch (error) {
      console.error('Error booking:', error);
      toast.error(error.message || 'Error booking appointment.', {
        id: toastId,
      });
    }
  };

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {salon && (
        <h1 className="text-3xl font-bold mb-4">
          Book an appointment at {salon.name}
        </h1>
      )}

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Step 1: Select a Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className={`p-4 border rounded-lg cursor-pointer ${selectedService?.id === service.id ? 'border-blue-500' : ''}`}
                onClick={() => setSelectedService(service)}
              >
                <h3 className="font-semibold">{service.name}</h3>
                <p>{service.description}</p>
                <p className="font-bold">{service.price}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={!selectedService}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
      {step === 2 && (
        <Step2_DateTime
          salon={salon}
          service={selectedService}
          onNext={(dateTime) => {
            setBooking({ ...booking, ...dateTime });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <Step3_UserDetails
          onNext={(userDetails) => {
            setBooking({ ...booking, ...userDetails });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 4 && (
        <Step4_Confirmation
          booking={booking}
          service={selectedService}
          salon={salon}
          onConfirm={handleConfirmBooking}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
