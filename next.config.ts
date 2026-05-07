import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Empêche les navigateurs de "deviner" le type MIME → XSS via upload
          { key: "X-Content-Type-Options",  value: "nosniff" },
          // Empêche le site d'être chargé dans une iframe → clickjacking
          { key: "X-Frame-Options",         value: "DENY" },
          // Active le filtre XSS des vieux navigateurs
          { key: "X-XSS-Protection",        value: "1; mode=block" },
          // Limite les infos envoyées dans le Referer
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
          // Désactive les permissions inutiles (micro, caméra, géoloc…)
          { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
