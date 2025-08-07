/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  ...nextConfig,
  basePath: '/hacker-news',
  output: 'standalone',
  images: {
    unoptimized: true
  }
}
