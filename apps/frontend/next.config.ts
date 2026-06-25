import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Monorepo: transpile shared packages
  transpilePackages: ['@aizen/types', 'framer-motion'],

  // Tối ưu images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },

  // Bật compression
  compress: true,

  // Experimental: tối ưu bundle size
  experimental: {
    optimizePackageImports: ['framer-motion', 'date-fns', 'lucide-react'],
  },
};

export default nextConfig;