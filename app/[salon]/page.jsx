'use client';

import { useState, useEffect, useCallback } from 'react';
import ModernBookingPage from '../components/Booking/ModernBookingPage';

export default function SalonPage({ params }) {
  const salonIdentifier = params.salon;

  // Hooks for the generic salon page
  const [salonData, setSalonData] = useState(null);
  const [loading, setLoading] = useState(true);


  const loadSocialMedia = useCallback(async () => {
    if (salonIdentifier === 'instyle-hair-boutique') return;
    try {
      // This is a placeholder for a real social media scraping implementation
      console.log('Scraping social media for', salonIdentifier);
    } catch (error) {
      console.error('Error loading social media data:', error);
    } finally {
      setLoading(false);
    }
  }, [salonIdentifier]);

  useEffect(() => {
    if (salonIdentifier !== 'instyle-hair-boutique') {
        const genericData = {
            name: 'Your Salon Name',
            description: 'Welcome to our salon.',
        };
        setSalonData(genericData);
        loadSocialMedia();
    } else {
        setLoading(false);
    }
  }, [salonIdentifier, loadSocialMedia]);

  if (salonIdentifier === 'instyle-hair-boutique') {
    return <ModernBookingPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{salonData?.name}</h1>
      <p>{salonData?.description}</p>
      {/* Render generic services, social media etc. */}
    </div>
  );
}