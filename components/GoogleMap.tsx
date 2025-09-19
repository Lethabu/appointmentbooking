'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  address: string;
  businessName: string;
  className?: string;
}

export default function GoogleMap({ address, businessName, className = "w-full h-64" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || !mapRef.current) return;

    const initMap = () => {
      if (!window.google) return;
      
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results: any, status: string) => {
        if (status === 'OK' && results?.[0]) {
          const map = new window.google.maps.Map(mapRef.current!, {
            zoom: 15,
            center: results[0].geometry.location,
            styles: [
              {
                featureType: 'poi.business',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'all',
                elementType: 'geometry.fill',
                stylers: [{ color: '#f5f5f5' }]
              }
            ]
          });

          new window.google.maps.Marker({
            position: results[0].geometry.location,
            map,
            title: businessName,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#8B5CF6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });
        }
      });
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [address, businessName]);

  return <div ref={mapRef} className={className} />;
}