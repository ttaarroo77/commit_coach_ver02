import webpack from 'webpack';
// ESモジュール形式でbufferをインポート
import { resolve as resolveModule } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirnameの代替（ESモジュールでは__dirnameが使えないため）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// bufferのパスを解決
const bufferPath = resolveModule(__dirname, '../node_modules/buffer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  experimental: {
    serverActions: {},
  },
  webpack: (config) => {
    // Node コア Polyfill を手動注入
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      buffer: bufferPath
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      })
    );
    return config;
  },
};

export default nextConfig;