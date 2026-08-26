import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pins the workspace root explicitly — otherwise Turbopack walks up and finds an
  // unrelated package-lock.json in a parent directory and warns about it.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
