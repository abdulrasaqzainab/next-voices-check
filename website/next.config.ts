import type { NextConfig } from "next";

// get repo name from GitHub Actions env, fallback to empty string for local dev
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';

const nextConfig: NextConfig = {
  // 1) Enable static HTML export
  output: 'export',

  // 2) If this is a project page, set basePath/assetPrefix automatically
  basePath: repo ? `/${repo}` : '',
  assetPrefix: repo ? `/${repo}/` : '',

  // 3) Configure images for static export
  images: {
    unoptimized: true,
    remotePatterns: [],
    loader: 'custom',
    loaderFile: './image-loader.ts',
  },

  // optional, trailing slash in exported paths
  trailingSlash: false,
};

export default nextConfig;
