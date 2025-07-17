// lib/services/paymentService.js

import { NetcashProvider } from './providers/netcashProvider';

const paymentProviders = {
  
  netcash: new NetcashProvider(),
};

export async function createPayment(provider, details) {
  if (!paymentProviders[provider]) {
    throw new Error('Invalid payment provider');
  }
  return paymentProviders[provider].createPayment(details);
}