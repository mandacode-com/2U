import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [new URL("https://2u.mandacode.com/api/**")],
  },
  productionBrowserSourceMaps: false
};

export default nextConfig;
