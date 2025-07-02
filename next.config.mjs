/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      'https://a0a81b81-e43e-4f6e-a0e5-2c534462dfce-00-2b7uhvz7qey3w.kirk.replit.dev',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/((?!api|_next|_static|favicon.ico).*)',
        destination: '/api/subdomain-handler',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>.*)\\.repl\\.co',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
