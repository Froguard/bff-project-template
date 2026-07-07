import type { NextConfig } from "next";

const cdnOrigin = process.env.NEXT_PUBLIC_CDN_ORIGIN?.replace(/\/$/, "");
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // 允许本地 dev 环境直接访问（hmr 所必须开启）
  allowedDevOrigins: ["127.0.0.1", "0.0.0.0", "localhost"],
  // 生产环境 CDN 配置
  assetPrefix: isProduction && cdnOrigin ? cdnOrigin : undefined,
  // 本地开发接口代理
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
  // 拆包策略优化
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
