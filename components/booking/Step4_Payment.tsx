'use client';
import React, { useState } from 'react';

interface Step4PaymentProps {
  data: { totalAmount: number };
  onSuccess: (paymentData: {
    status: string;
    method: string;
    amount: number;
  }) => void;
}

export const Step4_Payment: React.FC<Step4PaymentProps> = ({
  data,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handlePayment = () => {
    // In a real application, this would integrate with a payment gateway.
    // For now, simulate success.
    alert(
      `Processing payment of R${(data.totalAmount / 100).toFixed(2)} via ${paymentMethod}...`,
    );
    onSuccess({
      status: 'success',
      method: paymentMethod,
      amount: data.totalAmount,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">Payment</h2>
      <div className="flex flex-col space-y-2">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="paymentMethod"
            value="credit_card"
            checked={paymentMethod === 'credit_card'}
            onChange={() => setPaymentMethod('credit_card')}
          />
          <span className="ml-2">Credit Card</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="paymentMethod"
            value="eft"
            checked={paymentMethod === 'eft'}
            onChange={() => setPaymentMethod('eft')}
          />
          <span className="ml-2">EFT (Electronic Funds Transfer)</span>
        </label>
      </div>
      <div className="text-lg font-bold">
        Total Amount: R{(data.totalAmount / 100).toFixed(2)}
      </div>
      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        Complete Booking
      </button>
    </div>
  );
};
