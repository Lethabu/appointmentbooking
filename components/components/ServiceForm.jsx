"use client";
import { useState } from 'react';

export default function ServiceForm({ onServiceAdded }) {
  const [service, setService] = useState({ name: '', duration: 30, price: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...service,
        price: Math.round(parseFloat(service.price) * 100) // convert to cents
      })
    });
    setLoading(false);
    if (response.ok) {
      setService({ name: '', duration: 30, price: '' });
      if (onServiceAdded) onServiceAdded();
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to add service');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        className="input"
        value={service.name}
        onChange={(e) => setService({ ...service, name: e.target.value })}
        placeholder="Service Name"
        required
      />
      <input
        className="input"
        type="number"
        value={service.duration}
        onChange={(e) => setService({ ...service, duration: parseInt(e.target.value) })}
        placeholder="Duration (minutes)"
        required
      />
      <input
        className="input"
        type="number"
        value={service.price}
        onChange={(e) => setService({ ...service, price: e.target.value })}
        placeholder="Price (R)"
        required
      />
      <button className="btn" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Service'}</button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </form>
  );
}
