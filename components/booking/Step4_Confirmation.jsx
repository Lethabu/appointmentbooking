export function Step4_Confirmation({
  booking,
  service,
  salon,
  onConfirm,
  onBack,
}) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Step 4: Confirmation</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold">{salon.name}</h3>
        <p>{service.name}</p>
        <p>
          {booking.date} at {booking.time}
        </p>
        <p>{booking.name}</p>
        <p>{booking.email}</p>
        <p>{booking.phone}</p>
        <p className="font-bold text-lg mt-2">Total: {service.price}</p>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}