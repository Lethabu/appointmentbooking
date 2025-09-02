/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig; 