/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,

  serverExternalPackages: ['@supabase/supabase-js'],

  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  images: {
    domains: [
      'images.unsplash.com',
      'cdn-instyle',
      'instylehairboutique.co.za',
      'www.instylehairboutique.co.za',
      'firebasestorage.googleapis.com',
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
  },

  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/demo',
        destination: '/book-demo',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/book-appointment',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://clerk.accounts.dev/:path*',
        has: [{ type: 'host', value: 'clerk.appointmentbooking.co.za' }],
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];
  },
};

module.exports = nextConfig;
