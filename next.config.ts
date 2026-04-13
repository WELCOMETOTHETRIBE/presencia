import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./raw/**/*"],
  },
  serverExternalPackages: ["xlsx"],
};

export default nextConfig;
