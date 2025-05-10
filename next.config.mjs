/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    //remove these lines if you want to use eslint
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["res.cloudinary.com"]
  },
};

export default nextConfig;
