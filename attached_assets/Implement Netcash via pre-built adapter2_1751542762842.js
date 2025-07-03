// Simplified integration
import Netcash from '@netcash/payment-sdk';

const processSubscription = (salon) => {
  const netcash = new Netcash(process.env.NETCASH_ID);
  return netcash.createSubscription({
    amount: PLAN_PRICES[salon.plan],
    reference: `sub-${salon.id}`
  });
};