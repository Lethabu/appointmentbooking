/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs']
  }
};

export default nextConfig; 