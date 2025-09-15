'use client';
import { useEffect, useState } from 'react';
import { getRecentBookings } from '../lib/services/dashboard';

export default function RecentBookings({ salonId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getRecentBookings(salonId);
        setBookings(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    if (salonId) {
      fetchBookings();
    }
  }, [salonId]);

  if (loading) return <div>Loading recent bookings...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (bookings.length === 0) return <p>No recent bookings found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-2 px-4">Client</th>
            <th className="text-left py-2 px-4">Service</th>
            <th className="text-left py-2 px-4">Staff</th>
            <th className="text-left py-2 px-4">Date & Time</th>
            <th className="text-left py-2 px-4">Status</th>
            <th className="text-right py-2 px-4">Amount</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b">
              <td className="py-2 px-4">{booking.clientName}</td>
              <td className="py-2 px-4">{booking.appointment?.service?.name || 'N/A'}</td>
              <td className="py-2 px-4">{booking.appointment?.staff?.name || 'N/A'}</td>
              <td className="py-2 px-4">
                {new Date(booking.appointment?.startTime).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="text-right py-2 px-4">R{booking.totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
