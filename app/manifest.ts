import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InStyle Hair Booking',
    short_name: 'InStyle',
    description: 'Book your next hair appointment with InStyle Hair Boutique.',
    start_url: '/book',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8B5CF6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
    ],
  }
}