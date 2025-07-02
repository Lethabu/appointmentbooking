/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other configurations ...
  webpack: (config) => {
    config.resolve.alias['@/utils'] = path.join(__dirname, 'utils');
    return config;
  },
};

module.exports = nextConfig;

