import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // enables static export
  basePath: process.env.GITHUB_PAGES ? '/REPO_NAME' : '',
};

export default nextConfig;
