import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // Add any image domains you need
  },
  // Uncomment if you want to enable PWA features
  // experimental: {
  //   pwa: true,
  // }
};

export default nextConfig;
