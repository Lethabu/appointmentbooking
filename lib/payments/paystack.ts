import PaystackPop from '@paystack/inline-js';

interface PaystackProps {
  email: string;
  amount: number;
  appointmentId: string;
  tenantId: string;
  onSuccess: (transaction: any) => void;
}

export function usePaystack() {
  const payWithPaystack = ({
    email, amount, appointmentId, tenantId, onSuccess
  }: PaystackProps) => {
    const handler = new PaystackPop();
    handler.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
      email,
      amount: amount * 100, // Convert to kobo
      currency: 'ZAR',
      ref: `${tenantId}_${appointmentId}_${Date.now()}`,
      onSuccess,
      onCancel: () => console.log('Payment cancelled'),
    });
  };
  
  return { payWithPaystack };
}