import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
// เพิ่ม alias '@' เพื่อให้สามารถใช้ import แบบย่อได้ เช่น import { ProductionInterface } from "@/app/interface/ProductionInterface";