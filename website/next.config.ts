import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export
  output: 'export',

  // Configure for GitHub Pages
  basePath: '/next-voices-check',
  assetPrefix: '/next-voices-check/',

  // Configure images for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    loader: 'custom',
    loaderFile: './image-loader.ts',
  },

  // Use trailing slash for consistency
  trailingSlash: true,
};

export default nextConfig;
