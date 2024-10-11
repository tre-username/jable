/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**',
      },
    ],
  },

  // Rewrites are not required for dynamic routing, but leaving them in case you need it
  async rewrites() {
    return [
      {
        source: "/api/messages",
        destination: "/api/messages",
      },
      {
        source: "/api/direct-messages",
        destination: "/api/direct-messages",
      },
    ];
  },

  // Enable experimental features for server-side handling and app directory (if needed)
  experimental: {
    appDir: true, // Enable App Directory for dynamic routing
  },

  // Ensuring API routes are server-side (dynamic) and are not statically generated
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
