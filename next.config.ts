import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // あなたのSupabaseプロジェクトURLに合わせて許可
      },
    ],
  },
};

export default nextConfig;