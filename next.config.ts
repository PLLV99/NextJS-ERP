import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep existing custom webpack aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };
    return config;
  },
  // Add turbopack config so Next.js doesn't error when Turbopack is enabled
  turbopack: {
    // set the root to this project directory so Next infers the correct workspace
    root: path.resolve(__dirname),
  },
  // In dev, forward /api/* to the local Spring Boot backend.
  // In production this returns no rewrites; vercel.json handles routing on Vercel.
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/api/:path*",
        destination:
          (process.env.BACKEND_URL ?? "http://localhost:8080") + "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
// เพิ่ม alias '@' เพื่อให้สามารถใช้ import แบบย่อได้ เช่น import { ProductionInterface } from "@/app/interface/ProductionInterface";
