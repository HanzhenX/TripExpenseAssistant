import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   domains: ['i.pravatar.cc'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "tripmatebucket1213.s3.amazonaws.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // or '20mb', adjust as needed
    },
  },
};

export default nextConfig;
