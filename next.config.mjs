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
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
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
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/_next/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
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
