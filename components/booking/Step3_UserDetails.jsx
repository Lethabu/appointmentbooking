import { useState } from 'react';

export function Step3_UserDetails({ onNext, onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    onNext({ name, email, phone });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Step 3: Your Details</h2>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Phone</label>
        <input
          type="tel"
          className="w-full p-2 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!name || !email}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}