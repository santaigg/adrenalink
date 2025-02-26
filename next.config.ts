import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable ESLint during build
  eslint: {
    // Warning: This ignores all ESLint errors and warnings during the build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
