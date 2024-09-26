/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [
        "uploadthing.com"
      ]
    },
    trailingSlash: true,
  };
  
  export default nextConfig;
  