/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.instylehairboutique.co.za',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizeCss: true,
  },
  async rewrites() {
    return [
      {
        source: '/instylehairboutique',
        destination: '/instylehairboutique',
      },
    ];
  },
};

export default nextConfig;
