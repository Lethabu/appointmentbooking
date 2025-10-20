interface StatsCardsProps {
  bookings: Booking[]; // Replace 'any' with a proper Booking type later
}

export const StatsCards: React.FC<StatsCardsProps> = ({ bookings }) => {
  // Dummy data for demonstration
  const totalBookings = bookings ? bookings.length : 0;
  const revenue = bookings
    ? bookings.reduce(
        (sum: number, booking: Booking) => sum + (booking.amount || 0),
        0,
      )
    : 0;
  const avgBookingValue = totalBookings > 0 ? revenue / totalBookings : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-500">Total Bookings</h3>
        <p className="text-3xl font-bold">{totalBookings}</p>
      </div>
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-500">Total Revenue</h3>
        <p className="text-3xl font-bold">R{(revenue / 100).toFixed(2)}</p>
      </div>
      <div className="p-4 border rounded-lg shadow-sm bg-white md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-500">
          Average Booking Value
        </h3>
        <p className="text-3xl font-bold">
          R{(avgBookingValue / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

interface Booking {
  amount?: number; // Assuming amount is a number and optional
  // Add other properties as they are used in the component
}
