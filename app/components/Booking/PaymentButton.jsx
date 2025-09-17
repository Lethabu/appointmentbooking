'use client';
import { useState } from 'react';

export default function PaymentButton({ amount, email, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Convert to kobo
          customer_email: email,
          tenant_id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
        }),
      });

      const { payment_url } = await response.json();

      if (payment_url) {
        window.location.href = payment_url;
      }
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? 'Processing...' : `Pay R${amount}`}
    </button>
  );
}
