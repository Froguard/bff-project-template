import type { NextConfig } from "next";

const cdnOrigin = process.env.NEXT_PUBLIC_CDN_ORIGIN?.replace(/\/$/, "");
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  assetPrefix: isProduction && cdnOrigin ? cdnOrigin : undefined,
  async rewrites() {
    if (!isProduction) {
      return [
        {
          destination: "http://127.0.0.1:9999/api/:path*",
          source: "/api/:path*",
        },
      ];
    }

    return [];
  },
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          framework: {
            chunks: "all",
            name: "framework",
            priority: 40,
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
          },
          vendor: {
            chunks: "all",
            name: "vendor",
            priority: 30,
            reuseExistingChunk: true,
            test: /[\\/]node_modules[\\/]/,
          },
          shared: {
            chunks: "all",
            minChunks: 2,
            name: "shared",
            priority: 20,
            reuseExistingChunk: true,
            test: /[\\/]src[\\/](components|core|hooks|lib|utils)[\\/]/,
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
