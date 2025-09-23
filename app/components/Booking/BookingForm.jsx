'use client';
import { useState, useEffect, useCallback } from 'react';

export default function BookingForm({
  tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
}) {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    service_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    appointment_date: '',
    start_time: '',
  });
  const [loading, setLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    const response = await fetch(`/api/services?tenant_id=${tenantId}`);
    const data = await response.json();
    setServices(data);
  }, [tenantId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BOOKING_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tenant_id: tenantId }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Booking confirmed!');
        setFormData({
          service_id: '',
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          appointment_date: '',
          start_time: '',
        });
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>
      <form onSubmit={handleBooking} className="space-y-4">
        <select
          value={formData.service_id}
          onChange={(e) =>
            setFormData({ ...formData, service_id: e.target.value })
          }
          className="w-full p-3 border rounded"
          required
        >
          <option value="">Select Service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - R{service.price / 100}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Your Name"
          value={formData.customer_name}
          onChange={(e) =>
            setFormData({ ...formData, customer_name: e.target.value })
          }
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.customer_email}
          onChange={(e) =>
            setFormData({ ...formData, customer_email: e.target.value })
          }
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="tel"
          placeholder="Phone"
          value={formData.customer_phone}
          onChange={(e) =>
            setFormData({ ...formData, customer_phone: e.target.value })
          }
          className="w-full p-3 border rounded"
        />

        <input
          type="date"
          value={formData.appointment_date}
          onChange={(e) =>
            setFormData({ ...formData, appointment_date: e.target.value })
          }
          className="w-full p-3 border rounded"
          min={new Date().toISOString().split('T')[0]}
          required
        />

        <input
          type="time"
          value={formData.start_time}
          onChange={(e) =>
            setFormData({ ...formData, start_time: e.target.value })
          }
          className="w-full p-3 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}
