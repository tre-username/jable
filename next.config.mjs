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
};

export default nextConfig;
