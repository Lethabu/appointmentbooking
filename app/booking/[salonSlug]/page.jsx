'use client';

import { useParams } from 'next/navigation';

export default function BookingPage() {
  const params = useParams();
  const { salonSlug } = params;

  return (
    <div className="p-8 text-center">
      <h1>Booking Page for {salonSlug}</h1>
      <p>This is a test to see if the page renders.</p>
    </div>
  );
}
