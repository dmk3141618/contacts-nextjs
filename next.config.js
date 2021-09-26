/** @type {import('next').NextConfig} */
const path = require('path');
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },
  images: {
    disableStaticImages: true,
  },
};

module.exports = withPlugins([withBundleAnalyzer, withImages], nextConfig);
