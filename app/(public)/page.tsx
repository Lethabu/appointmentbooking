import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ReviewsCarousel } from '@/components/marketing/ReviewsCarousel';
import { ServiceHighlights } from '@/components/marketing/ServiceHighlights';
import { CTASection } from '@/components/marketing/CTASection';

export default function HomePage() {
  return (
    <main className="isolate">
      <ServiceHighlights /> {/* skeleton while fetching */}
      <ReviewsCarousel />
      <CTASection />
    </main>
  );
}