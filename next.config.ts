import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**.supabase.co" },
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "api.dicebear.com" },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
    compress: true,
    // output: "standalone", // uncomment for Docker/self-hosted deployments
};

export default nextConfig;
