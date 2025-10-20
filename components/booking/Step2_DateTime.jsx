import { useState } from 'react';

export function Step2_DateTime({ salon, service, onNext, onBack }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Dummy time slots
  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const handleNext = () => {
    onNext({ date: selectedDate, time: selectedTime });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Step 2: Select Date & Time
      </h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Select a Date</h3>
        <input type="date" onChange={(e) => setSelectedDate(e.target.value)} />
      </div>
      {selectedDate && (
        <div>
          <h3 className="font-semibold mb-2">Select a Time</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                className={`p-2 border rounded-lg ${selectedTime === time ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}