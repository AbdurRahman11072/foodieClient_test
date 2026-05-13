import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "imgs.search.brave.com", // 👈 add this
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // 👈 add this
      },
    ],
  },
  allowedDevOrigins: ["192.168.0.103"],
};

export default nextConfig;
