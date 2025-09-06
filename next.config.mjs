/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    domains: ["instagram.com", "tiktok.com", "cdninstagram.com"],
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
