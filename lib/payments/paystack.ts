interface PaystackProps {
  email: string;
  amount: number;
  appointmentId: string;
  tenantId: string;
  onSuccess: (transaction: PaystackResponse) => void;
}

export function usePaystack() {
  const payWithPaystack = async ({
    email,
    amount,
    appointmentId,
    tenantId,
    onSuccess,
  }: PaystackProps) => {
    const PaystackPop = (await import('@paystack/inline-js')).default;
    const handler = new PaystackPop();
    handler.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
      email,
      amount: amount * 100, // Convert to kobo
      currency: 'ZAR',
      reference: `${tenantId}_${appointmentId}_${Date.now()}`,
      onSuccess,
      onCancel: () => console.log('Payment cancelled'),
    });
  };

  return { payWithPaystack };
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

export function verifyPaystackSignature(payload: any, signature: string | null): boolean {
  if (!signature) return false;
  const crypto = require('crypto');
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  if (!secret) return false;
  const expectedSignature = crypto.createHmac('sha512', secret).update(JSON.stringify(payload)).digest('hex');
  return signature === expectedSignature;
}
