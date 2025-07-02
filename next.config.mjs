/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false // Using pages router
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
