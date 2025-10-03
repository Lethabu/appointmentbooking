<<<<<<< HEAD:app/(main)/pricing/PricingPageClient.tsx
import dynamic from 'next/dynamic';

<<<<<<<< HEAD:app/(main)/pricing/PricingPageClient.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
=======
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
>>>>>>> origin/feat/instyle-whitelabel:app/pricing/PricingPageClient.tsx
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, Star } from 'lucide-react';
import { checkout } from '@/lib/billing';

const tiers = [
  {
    name: 'Starter',
    id: 'starter',
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for small salons getting started',
    features: [
      'Up to 50 bookings/month',
      'Basic calendar management',
      'Email notifications',
      'Customer database',
      'Mobile responsive booking page',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Professional',
    id: 'pro',
    price: { monthly: 299, annual: 2990 },
    description: 'For growing salons that need more power',
    features: [
      'Unlimited bookings',
      'Multi-staff scheduling',
      'SMS & WhatsApp notifications',
      'Loyalty program',
      'Advanced analytics',
      'Custom branding',
      'AI chat support',
      'Inventory management',
    ],
    cta: 'Start Trial',
    popular: true,
  },
  {
    name: 'Scale',
    id: 'scale',
    price: { monthly: 749, annual: 7490 },
    description: 'For salon chains and enterprise needs',
    features: [
      'Everything in Professional',
      'Multi-location management',
      'Advanced reporting',
      'API access',
      'White-label solution',
      'Priority support',
      'Custom integrations',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const handleCheckout = (tier: string) => {
    if (tier === 'starter') {
      // Redirect to signup for free tier
      window.location.href = '/book-demo';
      return;
    }
<<<<<<< HEAD:app/(main)/pricing/PricingPageClient.tsx

=======
    
>>>>>>> origin/feat/instyle-whitelabel:app/pricing/PricingPageClient.tsx
    checkout({
      tier,
      tenantId: `tenant_${Date.now()}`,
      email: 'user@example.com', // This would come from auth
    });
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
<<<<<<< HEAD:app/(main)/pricing/PricingPageClient.tsx
            Choose the perfect plan for your salon. All plans include a 14-day
            free trial.
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={`text-sm ${!isAnnual ? 'font-semibold' : 'text-gray-500'}`}
            >
              Monthly
            </span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span
              className={`text-sm ${isAnnual ? 'font-semibold' : 'text-gray-500'}`}
            >
=======
            Choose the perfect plan for your salon. All plans include a 14-day free trial.
          </p>
          
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm ${isAnnual ? 'font-semibold' : 'text-gray-500'}`}>
>>>>>>> origin/feat/instyle-whitelabel:app/pricing/PricingPageClient.tsx
              Annual
            </span>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => (
<<<<<<< HEAD:app/(main)/pricing/PricingPageClient.tsx
            <Card
=======
            <Card 
>>>>>>> origin/feat/instyle-whitelabel:app/pricing/PricingPageClient.tsx
              key={tier.id}
              className={`relative ${tier.popular ? 'border-purple-500 shadow-lg scale-105' : 'border-gray-200'}`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  Most Popular
                </Badge>
              )}
<<<<<<< HEAD:app/(main)/pricing/PricingPageClient.tsx

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-base">
                  {tier.description}
                </CardDescription>
=======
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.description}</CardDescription>
>>>>>>> origin/feat/instyle-whitelabel:app/pricing/PricingPageClient.tsx
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    R{isAnnual ? tier.price.annual : tier.price.monthly}
                  </span>
                  <span className="text-gray-500">
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </div>
              </CardHeader>
<<<<<<< HEAD:app/(main)/pricing/PricingPageClient.tsx

              <CardContent>
                <Button
=======
              
              <CardContent>
                <Button 
>>>>>>> origin/feat/instyle-whitelabel:app/pricing/PricingPageClient.tsx
                  className={`w-full mb-6 ${tier.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  onClick={() => handleCheckout(tier.id)}
                >
                  {tier.cta}
                </Button>
<<<<<<< HEAD:app/(main)/pricing/PricingPageClient.tsx

=======
                
>>>>>>> origin/feat/instyle-whitelabel:app/pricing/PricingPageClient.tsx
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
<<<<<<< HEAD:app/(main)/pricing/PricingPageClient.tsx
                <Star
                  key={i}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              4.9/5 from 500+ reviews
            </span>
          </div>
          <p className="text-gray-600">
            &quot;The Platform transformed our salon operations. We&apos;ve seen
            a 300% increase in online bookings!&quot;
          </p>
          <p className="text-sm text-gray-500 mt-2">
            - Sarah M., InStyle Hair Boutique
          </p>
=======
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600">4.9/5 from 500+ reviews</span>
          </div>
          <p className="text-gray-600">
            &quot;AppointmentBooking transformed our salon operations. We&apos;ve seen a 300% increase in online bookings!&quot;
          </p>
          <p className="text-sm text-gray-500 mt-2">- Sarah M., InStyle Hair Boutique</p>
>>>>>>> origin/feat/instyle-whitelabel:app/pricing/PricingPageClient.tsx
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD:app/(main)/pricing/PricingPageClient.tsx
}
========
const PricingPageClient = dynamic(() => import('./PricingPageClient'), { ssr: false });

export default function PricingPage() {
  return <PricingPageClient />;
}
>>>>>>>> origin/feat/instyle-whitelabel:app/pricing/page.tsx
=======
}
>>>>>>> origin/feat/instyle-whitelabel:app/pricing/PricingPageClient.tsx
