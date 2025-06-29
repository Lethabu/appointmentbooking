import crypto from 'crypto'

/**
 * Verifies a signature from a Netcash webhook.
 * NOTE: This is a conceptual implementation. Refer to Netcash's official
 * documentation for the exact signature verification algorithm.
 * @param {object} payload - The raw request body.
 * @param {string} signature - The signature from the 'x-netcash-signature' header.
 * @param {string} secret - Your Netcash webhook secret key.
 * @returns {boolean}
 */
export function verifyNetcashSignature(payload, signature, secret) {
  // Netcash signature verification logic would go here.
  // It typically involves creating an HMAC hash of the payload with your secret.
  return true; // Placeholder
}

/**
 * Verifies a signature from a Paystack webhook.
 * @returns {boolean}
 */
export function verifyPaystackSignature(payload, signature, secret) {
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(payload)).digest('hex');
  return hash === signature;
}