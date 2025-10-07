import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', 
  basePath: process.env.GITHUB_PAGES ? '/REPO_NAME' : '',
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;
