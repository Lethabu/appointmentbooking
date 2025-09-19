import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
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
  async rewrites() {
    return {
      beforeFiles: [
        // Handle instylehairboutique.co.za domain
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'instylehairboutique.co.za',
            },
          ],
          destination: '/instyle/:path*',
        },
        // Handle www redirect
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'www.instylehairboutique.co.za',
            },
          ],
          destination: 'https://instylehairboutique.co.za/:path*',
        },
      ],
    };
  },
};

export default withBundleAnalyzer(nextConfig);
