// components/AI/WhatsAppReminderSetup.jsx
'use client';
import { useState } from 'react';

export default function WhatsAppReminderSetup({ appointmentId }) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/webhooks/booking-confirmed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: appointmentId, phone })
      });
      const data = await res.json();
      if (data.success) setStatus('WhatsApp reminder enabled!');
      else setStatus('Failed to enable reminder.');
    } catch (err) {
      setStatus('Error enabling reminder.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="block text-sm font-medium">WhatsApp Number</label>
      <input
        type="tel"
        className="border rounded px-3 py-2 w-full"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="e.g. +27 82 123 4567"
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Enabling…' : 'Enable Reminder'}</button>
      {status && <div className="text-sm mt-1">{status}</div>}
    </form>
  );
}
