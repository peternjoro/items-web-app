/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  },
  staticPageGenerationTimeout: 120,
  images: {
    domains: ['picsum.photos'],
  },
}

module.exports = nextConfig
