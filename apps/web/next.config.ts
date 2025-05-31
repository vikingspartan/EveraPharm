import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['everapharm.com', 'api.everapharm.com'],
  },
  poweredByHeader: false,
  compress: true,
  // Optimize for production
  reactStrictMode: true,
};

export default nextConfig;
