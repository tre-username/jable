/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enables React Strict Mode for better debugging
    images: {
      // Add any domains you need to load images from
      domains: ['https://benevolent-kelpie-864e24.netlify.app'], // Update this with actual domains
    },
    trailingSlash: true, // Optional: Adds a trailing slash to all pages
  };
  
  export default nextConfig;
  