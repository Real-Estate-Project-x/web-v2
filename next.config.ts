import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',         
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',         
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',         
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',         
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',         
        pathname: '/**',
      }
    ],
  }
};

export default nextConfig;
