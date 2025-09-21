/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: ['images.unsplash.com', 'cdn-instyle', 'instylehairboutique.co.za', 'www.instylehairboutique.co.za'],
    formats: ['image/webp', 'image/avif']
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https://instylehairboutique.co.za https://www.instylehairboutique.co.za https://clerk.appointmentbooking.co.za; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://js.clerk.com https://clerk.appointmentbooking.co.za https://instylehairboutique.co.za https://www.instylehairboutique.co.za; style-src 'self' 'unsafe-inline' https://instylehairboutique.co.za https://www.instylehairboutique.co.za; font-src 'self' data: https://instylehairboutique.co.za https://www.instylehairboutique.co.za; img-src 'self' data: https:; connect-src 'self' https:; frame-src 'self' https:;"
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/chunks/(.*).js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript'
          }
        ]
      },
      {
        source: '/_next/static/css/(.*).css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css'
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/instyle',
        destination: '/instylehairboutique',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;