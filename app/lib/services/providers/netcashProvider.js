// lib/services/providers/netcashProvider.js
const NETCASH_API_KEY = process.env.NETCASH_API_KEY;
const NETCASH_SIGNATURE = process.env.NETCASH_SIGNATURE;
const NETCASH_BASE_URL =
  process.env.NETCASH_BASE_URL || 'https://api.netcash.co.za/v1/';

export class NetcashProvider {
  async createPayment(details) {
    const { amount, reference, return_url } = details;

    if (!amount || !reference || !return_url) {
      throw new Error('Missing required fields for Netcash payment');
    }

    const payload = {
      amount,
      reference,
      returnUrl: return_url,
    };

    const res = await fetch(`${NETCASH_BASE_URL}payments/once-off`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: NETCASH_API_KEY,
        Signature: NETCASH_SIGNATURE,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Netcash API error');
    }

    const data = await res.json();
    return { success: true, payment_url: data.payment_url || data.url, data };
  }
}
