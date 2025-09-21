const cspHeader = `
  default-src 'self' https://instylehairboutique.co.za https://www.instylehairboutique.co.za;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.clerk.com https://*.clerk.accounts.dev https://*.clerk.com https://instylehairboutique.co.za https://www.instylehairboutique.co.za;
  style-src 'self' 'unsafe-inline' https://instylehairboutique.co.za https://www.instylehairboutique.co.za;
  img-src 'self' blob: data: https:;
  font-src 'self' data: https://instylehairboutique.co.za https://www.instylehairboutique.co.za;
  connect-src 'self' https: wss:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

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
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim()
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
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
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/media/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;