import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InStyle Hair Boutique',
    short_name: 'InStyle',
    description: 'Premium hair services and products - Book appointments and shop online',
    start_url: '/instylehairboutique',
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
