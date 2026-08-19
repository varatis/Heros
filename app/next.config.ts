import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ulsspeaijxmwluiipxby.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // PWA sera configuré avec Serwist en session 4 (polish)
};

export default nextConfig;
