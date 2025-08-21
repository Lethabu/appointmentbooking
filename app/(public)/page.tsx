import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
// import { ReviewsCarousel } from '@/components/marketing/ReviewsCarousel';
// import { ServiceHighlights } from '@/components/marketing/ServiceHighlights';
// import { CTASection } from '@/components/marketing/CTASection';

// const VideoHero = dynamic(() => import('@/components/marketing/VideoHero'), { ssr: false });

export default function HomePage() {
  return (
    <main className="isolate">
      {/* <VideoHero /> {/* autoplay muted, 3 s load, LCP < 1.8 s */}
      {/* <ServiceHighlights /> {/* skeleton while fetching */}
      {/* <ReviewsCarousel /> */}
      {/* <CTASection /> */}
    </main>
  );
}
