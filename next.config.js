/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images-assets.nasa.gov",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "images-assets.nasa.gov",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
