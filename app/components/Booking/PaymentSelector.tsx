'use client';
import { Button } from '@/components/ui/button';
import { usePaystack } from '@/lib/payments/paystack';

interface PaymentSelectorProps {
  amount: number;
  email: string;
  appointmentId: string;
  tenantId: string;
  onPaymentSuccess: (transaction: PaystackResponse) => void;
}

export function PaymentSelector({
  amount,
  email,
  appointmentId,
  tenantId,
  onPaymentSuccess,
}: PaymentSelectorProps) {
  const { payWithPaystack } = usePaystack();

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Choose Payment Method</h3>
      <div className="grid gap-2">
        <Button
          onClick={() =>
            payWithPaystack({
              email,
              amount,
              appointmentId,
              tenantId,
              onSuccess: onPaymentSuccess,
            })
          }
          className="w-full"
        >
          Pay R{amount} with Paystack (Recommended)
        </Button>
        <Button variant="outline" className="w-full">
          Pay with PayFast (Existing)
        </Button>
      </div>
    </div>
  );
}

interface PaystackResponse {
  status: string;
  message: string;
  reference: string;
  transaction: string;
  trxref: string;
  data?: {
    access_code: string;
  };
}
