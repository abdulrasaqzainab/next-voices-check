import type { NextConfig } from "next";

// get repo name from GitHub Actions env, fallback to empty string for local dev
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';

const nextConfig: NextConfig = {
  // 1) Enable static HTML export
  output: 'export',

  // 2) If this is a project page, set basePath/assetPrefix automatically
  basePath: repo ? `/${repo}` : '',
  assetPrefix: repo ? `/${repo}/` : '',

  // Configure images for static export
  images: {
    unoptimized: true,
    path: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/_next/image` : '/_next/image',
    loader: 'custom',
    loaderFile: './image-loader.ts',
  },

  // Use trailing slash for consistency
  trailingSlash: true,
};

export default nextConfig;
