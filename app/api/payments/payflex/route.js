// app/api/payments/payflex/route.js
import { NextResponse } from 'next/server';

// Payflex API credentials from environment variables
const PAYFLEX_MERCHANT_ID = process.env.PAYFLEX_MERCHANT_ID;
const PAYFLEX_API_KEY = process.env.PAYFLEX_API_KEY;
const PAYFLEX_BASE_URL = process.env.PAYFLEX_BASE_URL || 'https://api.payflex.co.za/';

export async function POST(req) {
  try {
    const { salon_id, user_id, amount, reference, return_url } = await req.json();
    // Validate required fields
    if (!amount || !reference || !return_url) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare Payflex payment request payload
    const payload = {
      amount,
      reference,
      returnUrl: return_url,
      // Add more fields as required by Payflex API
    };

    // Call Payflex API to initiate payment
    const res = await fetch(`${PAYFLEX_BASE_URL}api/payment/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Merchant-Id': PAYFLEX_MERCHANT_ID,
        'Api-Key': PAYFLEX_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ success: false, error: errorData.message || 'Payflex API error' }, { status: 500 });
    }

    const data = await res.json();
    // Assume Payflex returns a payment_url or similar
    return NextResponse.json({ success: true, payment_url: data.payment_url || data.url, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
