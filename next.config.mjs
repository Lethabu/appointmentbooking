/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    css: {
      enableCssManifestDebug: true
    }
  },
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        dns: false,
        net: false,
        tls: false,
      };
      config.externals.push('pg');
    }
    return config;
  },
};

export default nextConfig; 