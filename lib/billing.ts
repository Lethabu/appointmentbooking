import PaystackPop from '@paystack/inline-js';

interface CheckoutParams {
  tier: string;
  tenantId: string;
  email: string;
}

export function checkout({ tier, tenantId, email }: CheckoutParams) {
  const amounts = { 
    starter: 0, 
    pro: 29900, // R299 in kobo (cents)
    scale: 74900 // R749 in kobo (cents)
  };
  
  const amount = amounts[tier as keyof typeof amounts];
  
  if (amount === 0) {
    // Free tier - create tenant directly
    return createTenant({ tenantId, tier });
  }

  const popup = new PaystackPop();
  popup.newTransaction({
    key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
    email,
    amount,
    currency: 'ZAR',
    reference: `sub_${tenantId}_${Date.now()}`,
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
        }
      ]
    },
    onSuccess: (transaction) => {
      console.log('Payment successful:', transaction);
      createTenant({ tenantId, tier, paid: true });
    },
    onCancel: () => {
      console.log('Payment cancelled');
    },
  });
}

async function createTenant({ tenantId, tier, paid = false }: { 
  tenantId: string; 
  tier: string; 
  paid?: boolean; 
}) {
  try {
    const response = await fetch('/api/tenants/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, tier, paid }),
    });
    
    if (response.ok) {
      const { slug } = await response.json();
      window.location.href = `/dashboard/${slug}`;
    }
  } catch (error) {
    console.error('Failed to create tenant:', error);
  }
}