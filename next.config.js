/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add pdf-parse to externals
      config.externals = [...(config.externals || []), 'pdf-parse'];
    }
    return config;
  },
};

module.exports = nextConfig;