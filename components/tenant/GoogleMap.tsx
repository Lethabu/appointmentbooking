'use client';

interface GoogleMapProps {
  address: string;
}

export default function GoogleMap({ address }: GoogleMapProps) {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(address)}`;

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}