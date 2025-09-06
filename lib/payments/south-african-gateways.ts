// South African Payment Gateway Integration

export interface PaymentRequest {
  amount: number // in cents
  email: string
  reference: string
  callback_url: string
}

// Paystack Integration (Primary)
export async function createPaystackPayment(data: PaymentRequest) {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      amount: data.amount,
      reference: data.reference,
      callback_url: data.callback_url,
      currency: 'ZAR'
    }),
  })
  
  return response.json()
}

// Yoco Integration (Alternative)
export async function createYocoPayment(data: PaymentRequest) {
  const response = await fetch('https://online.yoco.com/v1/charges/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: data.amount,
      currency: 'ZAR',
      metadata: {
        reference: data.reference,
        email: data.email
      }
    }),
  })
  
  return response.json()
}

// Ozow Integration (Bank Transfer)
export async function createOzowPayment(data: PaymentRequest) {
  const response = await fetch('https://api.ozow.com/postpaymentrequest', {
    method: 'POST',
    headers: {
      'ApiKey': process.env.OZOW_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: (data.amount / 100).toFixed(2),
      transactionReference: data.reference,
      bankReference: data.reference,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancelled`,
      successUrl: data.callback_url,
      notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/ozow`,
      customer: data.email
    }),
  })
  
  return response.json()
}