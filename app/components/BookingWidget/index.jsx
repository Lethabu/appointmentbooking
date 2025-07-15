'use client';
import { useState, useEffect } from 'react';
import { getServices } from '@/lib/services/service';
import { getStaff } from '@/lib/services/staff';
import { getAvailableSlots } from '@/lib/services/availability';
import { createAppointment } from '@/lib/services/appointments';

export default function BookingWidget({ businessId }) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clientDetails, setClientDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      const services = await getServices(businessId);
      setServices(services);
    };
    if (businessId) {
      fetchServices();
    }
  }, [businessId]);

  useEffect(() => {
    if (selectedService) {
      const fetchStaff = async () => {
        const staff = await getStaff(businessId);
        setStaff(staff);
      };
      fetchStaff();
    }
  }, [selectedService, businessId]);

  useEffect(() => {
    if (selectedService && selectedStaff && selectedDate) {
      const fetchSlots = async () => {
        const slots = await getAvailableSlots(
          selectedStaff.id,
          selectedService.id,
          selectedDate
        );
        setAvailableSlots(slots);
      };
      fetchSlots();
    }
  }, [selectedService, selectedStaff, selectedDate]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    setStep(3);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(4);
  };

  const handleClientDetailsChange = (e) => {
    setClientDetails({
      ...clientDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    try {
      await createAppointment({
        serviceId: selectedService.id,
        staffId: selectedStaff.id,
        startTime: selectedSlot.startTime,
        clientName: clientDetails.name,
        clientEmail: clientDetails.email,
        clientPhone: clientDetails.phone,
      });
      setStep(5);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Select a service</h2>
          <ul>
            {services.map((service) => (
              <li key={service.id} onClick={() => handleServiceSelect(service)}>
                {service.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Select a staff member</h2>
          <ul>
            {staff.map((s) => (
              <li key={s.id} onClick={() => handleStaffSelect(s)}>
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Select a date and time</h2>
          <input
            type="date"
            onChange={(e) => handleDateChange(new Date(e.target.value))}
          />
          <ul>
            {availableSlots.map((slot) => (
              <li key={slot.startTime} onClick={() => handleSlotSelect(slot)}>
                {new Date(slot.startTime).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2>Enter your details</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleClientDetailsChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleClientDetailsChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            onChange={handleClientDetailsChange}
          />
          <button onClick={handleBooking}>Book now</button>
        </div>
      )}
      {step === 5 && (
        <div>
          <h2>Booking confirmed!</h2>
        </div>
      )}
    </div>
  );
}
