import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.madski.co.kr",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "90mb",
    },
  },
};

export default nextConfig;
