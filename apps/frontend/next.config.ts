import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Monorepo: transpile shared packages
  transpilePackages: ['@aizen/types'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
};

export default nextConfig;
