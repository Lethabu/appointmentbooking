import dynamic from 'next/dynamic';

const PricingPageClient = dynamic(() => import('./PricingPageClient'), { ssr: false });

export default function PricingPage() {
  return <PricingPageClient />;
}