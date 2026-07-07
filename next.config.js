/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.islamic.network" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
};

module.exports = withPWA(nextConfig);
