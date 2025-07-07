import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // Allow images from any hostname
      },
      {
        protocol: 'https',
        hostname: '**', // Allow images from any hostname
      },
    ],
  },
};

export default nextConfig;
