interface CalendarViewProps {
  bookings: Booking[]; // Replace 'any' with a proper Booking type later
}

export const CalendarView: React.FC<CalendarViewProps> = ({ bookings }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
      <div className="text-center text-gray-500">
        {/* Placeholder for a calendar component */}
        <p>Calendar component will go here.</p>
        <p>Displaying {bookings ? bookings.length : 0} bookings.</p>
        {bookings && bookings.length > 0 && (
          <ul className="mt-4 text-left">
            {bookings.map((booking: Booking, index: number) => (
              <li key={index} className="text-sm">
                Booking ID: {booking.id || 'N/A'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

interface Booking {
  id: string; // Assuming id is a string
  // Add other properties as they are used in the component
}
