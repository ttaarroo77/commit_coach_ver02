/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  experimental: {
    serverActions: {
      // Next.js 15.3.1ではboolean値ではなくオブジェクトが必要
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config) => {
    // Node コア Polyfill を手動注入
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      })
    );
    return config;
  },
};

module.exports = nextConfig;
