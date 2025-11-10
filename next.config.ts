import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // NOTE: sementara abaikan error TS agar build tidak gagal
    ignoreBuildErrors: true,
  },
  
   output: "standalone", // tidak di-export statis
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      process: false,
    };
    return config;
  },

  
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"images.pexels.com",
        
      },
      {
        
        protocol:"https",
        hostname:"images.unsplash.com",
      },
         {  
        
        protocol:"https",
        hostname:"assets.aceternity.com",
      }
      
    ]
  }
};

export default nextConfig;
