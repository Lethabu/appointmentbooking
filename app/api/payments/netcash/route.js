// app/api/payments/netcash/route.js
import { NextResponse } from 'next/server';

// Netcash API credentials from environment variables
const NETCASH_API_KEY = process.env.NETCASH_API_KEY;
const NETCASH_SIGNATURE = process.env.NETCASH_SIGNATURE;
const NETCASH_BASE_URL = process.env.NETCASH_BASE_URL || 'https://api.netcash.co.za/v1/';

export async function POST(req) {
  try {
    const { salon_id, user_id, amount, reference, return_url } = await req.json();
    // Validate required fields
    if (!amount || !reference || !return_url) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare Netcash payment request payload
    const payload = {
      amount,
      reference,
      returnUrl: return_url,
      // Add more fields as required by Netcash API
    };

    // Call Netcash API to initiate payment
    const res = await fetch(`${NETCASH_BASE_URL}payments/once-off`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': NETCASH_API_KEY,
        'Signature': NETCASH_SIGNATURE,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ success: false, error: errorData.message || 'Netcash API error' }, { status: 500 });
    }

    const data = await res.json();
    // Assume Netcash returns a payment_url or similar
    return NextResponse.json({ success: true, payment_url: data.payment_url || data.url, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
