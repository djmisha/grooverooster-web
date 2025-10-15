/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "djmisha.com",
        pathname: "/wordpress/wp-content/**",
      },
    ],
  },
  reactStrictMode: true,
  // Note: exportPathMap is not supported with App Router
  // If you need to exclude routes from static export, use route.js with { dynamic: 'force-static' }
};

module.exports = nextConfig;

