/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  trailingSlash: false,
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
      'appointmentbooking.co.za',
      'localhost'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  async headers() {
    return [
      {
        source: '/tenants/:tenant/:asset*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' }
        ]
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/tenants/:tenant/:asset*',
        destination: '/tenants/:tenant/:asset*'
      }
    ];
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  }
};

module.exports = nextConfig;

nextConfig.webpack = (config, { isServer }) => {
  if (isServer) {
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
    ];
  }
  return config;
};
