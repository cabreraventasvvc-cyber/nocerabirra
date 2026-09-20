import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    localPatterns: [
      {
        pathname: "/images/**"
      }
    ]
  }
};

export default nextConfig;
