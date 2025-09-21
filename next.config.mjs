import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Multi-tenant configuration
const getTenantConfig = () => {
  const hostname = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || '';
  
  // Determine if this is a tenant deployment
  if (hostname.includes('instylehairboutique')) {
    return {
      basePath: '',
      assetPrefix: '',
      tenant: 'instylehairboutique'
    };
  }
  
  return {
    basePath: '',
    assetPrefix: '',
    tenant: null
  };
};

const tenantConfig = getTenantConfig();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Multi-tenant configuration
  basePath: tenantConfig.basePath,
  assetPrefix: tenantConfig.assetPrefix,
  
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['instylehairboutique.co.za', 'appointmentbooking.co.za'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  swcMinify: true,
  trailingSlash: false,
  
  // Fix CORS and asset loading
  webpack: (config, { dev, isServer }) => {
    // Handle CSS and static assets properly
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss|sass)$/,
        chunks: 'all',
        enforce: true,
      };
    }
    return config;
  },
  
  // Critical: Fix asset and script loading
  generateBuildId: async () => {
    return 'build-' + Date.now();
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
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://js.clerk.com https://clerk.appointmentbooking.co.za https://instylehairboutique.co.za https://www.instylehairboutique.co.za; style-src 'self' 'unsafe-inline' https://instylehairboutique.co.za https://www.instylehairboutique.co.za; font-src 'self' data: https://instylehairboutique.co.za https://www.instylehairboutique.co.za; img-src 'self' data: https: blob:; connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.appointmentbooking.co.za;",
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css',
          },
        ],
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
    ];
  },
  
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.instylehairboutique.co.za',
          },
        ],
        destination: 'https://instylehairboutique.co.za/:path*',
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
