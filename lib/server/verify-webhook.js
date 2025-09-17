import crypto from 'crypto';

export function verifyPaystackSignature(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === signature;
}

export function verifyNetcashSignature(payload, signature, secret) {
  // NOTE: Assuming Netcash also uses HMAC-SHA256 for signature verification.
  // Please confirm the correct algorithm from Netcash's official documentation.
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === signature;
}
