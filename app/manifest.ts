import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AppointmentBooking - Salon Management Platform',
    short_name: 'AppointmentBooking',
    description: 'The complete salon booking and management platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8B5CF6',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['business', 'productivity'],
    lang: 'en',
    orientation: 'portrait-primary',
  };
}