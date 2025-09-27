interface CheckoutParams {
  tier: string;
  tenantId: string;
  email: string;
  period?: 'monthly' | 'annual';
}

const getTierAmount = (tier: string, period: 'monthly' | 'annual' = 'monthly'): number => {
  const prices = {
    starter: { monthly: 0, annual: 0 },
    pro: { monthly: 29900, annual: 299000 }, // in kobo (ZAR * 100)
    scale: { monthly: 74900, annual: 749000 },
  };
  return prices[tier as keyof typeof prices]?.[period] || 0;
};

export async function checkout({ tier, tenantId, email, period = 'monthly' }: CheckoutParams) {
  const amount = getTierAmount(tier, period);
  
  if (amount === 0) {
    // Free tier
    window.location.href = '/book-demo';
    return;
  }

  try {
    const PaystackPop = (await import('@paystack/inline-js')).default;
    const paystack = new PaystackPop();

    const reference = `${tenantId}_${tier}_${period}_${Date.now()}`;

    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
      email,
      amount,
      currency: 'ZAR',
      reference,
      metadata: {
        custom_fields: [
          {
            display_name: "Subscription Tier",
            variable_name: "tier",
            value: tier
          },
          {
            display_name: "Tenant ID",
            variable_name: "tenantId",
            value: tenantId
          },
          {
            display_name: "Period",
            variable_name: "period",
            value: period
          }
        ]
      },
      onSuccess: function(response: any) {
        // Handle success - verify on server if needed
        window.location.href = `/order-success?reference=${response.reference}&status=success`;
      },
      onCancel: function() {
        console.log('Payment cancelled');
        window.location.href = '/pricing?cancelled=true';
      },
    });
  } catch (error) {
    console.error('Paystack initialization error:', error);
    alert('Payment initialization failed. Please try again.');
  }
}