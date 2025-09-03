/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  serverExternalPackages: ['@clerk/nextjs']
};

export default nextConfig; 